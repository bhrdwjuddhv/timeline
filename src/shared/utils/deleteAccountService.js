import service from "@/appwrite/config.js";
import { destroyAutoSync } from "@/shared/utils/autoSyncManager.js";
import store from "@/store/store.js";
import { clearCalendars } from "@/store/calendarSlice.js";
import { clearTasks } from "@/store/taskSlice.js";
import { logout } from "@/store/AuthSlice.js";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

function clearLocalData(userId) {
    localStorage.removeItem(`timeline_calendars_${userId}`);
    localStorage.removeItem(`timeline_tasks_${userId}`);
    localStorage.removeItem("timeline_theme");
    sessionStorage.clear();
}

export async function deleteAccount(userId) {

    // Step 1: Delete all tasks belonging to the user
    const tasksResult = await service.getTasksByUser(userId);
    await Promise.all(
        tasksResult.documents.map((task) => service.deleteTask(task.$id))
    );

    // Step 2: Delete all calendars belonging to the user
    // deleteCalendar internally tries to cascade-delete tasks first (safe no-op since already deleted)
    const calendarsResult = await service.getCalendars(userId);
    await Promise.all(
        calendarsResult.documents.map((cal) => service.deleteCalendar(cal.$id))
    );

    // Step 3: Delete Appwrite authentication account via secure backend
    const response = await fetch(`${SERVER_URL}/api/user/delete-account`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete account");
    }

    // Step 4: Clear all local state
    destroyAutoSync();
    store.dispatch(clearCalendars());
    store.dispatch(clearTasks());
    store.dispatch(logout());
    clearLocalData(userId);
}
