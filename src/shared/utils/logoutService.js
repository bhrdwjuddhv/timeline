import authService from "@/appwrite/auth.js";
import store from "@/store/store.js";
import { logout } from "@/store/AuthSlice.js";
import { clearCalendars } from "@/store/calendarSlice.js";
import { clearTasks } from "@/store/taskSlice.js";
import { destroyAutoSync } from "@/shared/utils/autoSyncManager.js";

/*
======================================================
LOGOUT SERVICE

Central logout handler — called from any UI component.
Guarantees full cleanup in this order:

  1. Stop background sync (avoid writes after logout)
  2. Delete Appwrite session
  3. Clear Redux (no stale workspace data)
  4. Wipe user-scoped localStorage cache
  5. Auth state cleared last (guards against race)
======================================================
*/

export async function performLogout() {

    const state = store.getState();
    const userId = state.auth?.userData?.$id;

    /*
    1. Stop auto-sync immediately so no in-flight
       writes fire against the terminated session.
    */
    destroyAutoSync();

    /*
    2. Invalidate the Appwrite session.
       Errors are swallowed — the local cleanup
       must still run even if the network is down.
    */
    try {
        await authService.logout();
    } catch (error) {
        console.warn("Appwrite session deletion failed:", error);
    }

    /*
    3. Clear Redux — no user data remains in memory.
    */
    store.dispatch(clearCalendars());
    store.dispatch(clearTasks());
    store.dispatch(logout());

    /*
    4. Wipe the localStorage cache for this user.
       Generic keys from the old pre-refactor schema
       are also cleared for housekeeping.
    */
    try {
        if (userId) {
            localStorage.removeItem(`timeline_calendars_${userId}`);
            localStorage.removeItem(`timeline_tasks_${userId}`);
        }
        /* Legacy keys */
        localStorage.removeItem("timeline_tasks");
        localStorage.removeItem("timeline_calendars");
        localStorage.removeItem("timeline_theme");
    } catch (e) {
        console.warn("localStorage cleanup failed:", e);
    }
}
