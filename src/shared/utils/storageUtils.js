import service from "@/appwrite/config.js";
import store from "@/store/store.js";

import {
    setCalendars,
    addCalendar as addCalendarAction,
    updateCalendar as updateCalendarAction,
    deleteCalendar as deleteCalendarAction,
    markCalendarSynced as markCalendarSyncedAction,
    markCalendarFailed as markCalendarFailedAction,
} from "@/store/calendarSlice.js";

import {
    setTasks,
    addTask as addTaskAction,
    updateTask as updateTaskAction,
    deleteTask as deleteTaskAction,
    deleteTasksByCalendarId as deleteTasksByCalendarIdAction,
    bulkUpdateTasks as bulkUpdateTasksAction,
    markTaskSynced as markTaskSyncedAction,
    markTaskFailed as markTaskFailedAction,
} from "@/store/taskSlice.js";

/*
======================================================
HELPERS
======================================================
*/

function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;
}

function now() {
    return Date.now();
}

/*
======================================================
CALENDARS — READ (from Redux state)
======================================================
*/

export function getCalendars() {
    return store.getState().calendars.calendars;
}

export function getCalendarById(id) {
    return store
        .getState()
        .calendars.calendars.find((c) => c.id === id);
}

/*
======================================================
CALENDARS — WRITE (via Redux dispatch → middleware → localStorage)
======================================================
*/

export function saveCalendars(calendars) {
    store.dispatch(setCalendars(calendars));
}

export function createCalendar(calendarData = {}) {
    const calendars = getCalendars();

    const normalizedName = String(
        calendarData.name || ""
    ).trim();

    const existing = calendars.find(
        (c) =>
            String(c.name).trim().toLowerCase() ===
            normalizedName.toLowerCase()
    );

    if (existing) return existing;

    const id = String(
        `cal_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`
    );

    const timestamp = now();

    const calendar = {
        id,
        appwriteId: null,
        name: normalizedName,
        theme: String(calendarData.theme || "midnight"),
        icon: String(calendarData.icon || "bi-calendar3"),
        shared: false,
        syncStatus: "pending",
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    store.dispatch(addCalendarAction(calendar));
    return calendar;
}

export function updateCalendar(id, updates) {
    store.dispatch(updateCalendarAction({ id, updates }));
}

export async function deleteCalendar(id) {
    try {
        const calendar = getCalendarById(id);
        if (!calendar) return;

        if (
            calendar.appwriteId &&
            typeof calendar.appwriteId === "string"
        ) {
            try {
                await service.deleteCalendar(
                    calendar.appwriteId
                );
            } catch (error) {
                console.error(
                    "Cloud calendar delete failed:",
                    error
                );
            }
        }

        store.dispatch(deleteCalendarAction(id));
        store.dispatch(deleteTasksByCalendarIdAction(id));
    } catch (error) {
        console.error("deleteCalendar error:", error);
    }
}

/*
======================================================
TASKS — READ (from Redux state)
======================================================
*/

export function getTasks() {
    return store.getState().tasks.tasks;
}

export function getTaskById(taskId) {
    return store
        .getState()
        .tasks.tasks.find((t) => t.id === taskId);
}

export function getTasksByCalendarId(calendarId) {
    return store
        .getState()
        .tasks.tasks.filter((t) => t.calendarId === calendarId);
}

/*
======================================================
TASKS — WRITE (via Redux dispatch → middleware → localStorage)
======================================================
*/

export function saveTasks(tasks) {
    store.dispatch(setTasks(tasks));
}

export function createTask(calendarId, taskData = {}) {
    const timestamp = now();

    const task = {
        id: String(generateId("task")),
        appwriteId: null,
        calendarId: String(calendarId),
        title: String(taskData.title || ""),
        description: String(taskData.description || ""),
        completed: Boolean(taskData.completed),
        priority: String(taskData.priority || "medium"),
        date: String(taskData.date || ""),
        time: String(taskData.time || ""),
        socialMedia: String(
            taskData.socialMedia || "instagram"
        ),
        column: String(taskData.column || "todo"),
        position: Number(taskData.position || 0),
        color: String(taskData.color || ""),
        syncStatus: "pending",
        createdAt: timestamp,
        updatedAt: timestamp,
    };

    store.dispatch(addTaskAction(task));
    return task;
}

export function updateTask(taskId, updates) {
    store.dispatch(updateTaskAction({ id: taskId, updates }));
}

export async function deleteTask(taskId) {
    try {
        const task = getTaskById(taskId);
        if (!task) return;

        if (
            task.appwriteId &&
            typeof task.appwriteId === "string"
        ) {
            try {
                await service.deleteTask(task.appwriteId);
            } catch (error) {
                console.error(
                    "Cloud task delete failed:",
                    error
                );
            }
        }

        store.dispatch(deleteTaskAction(taskId));
    } catch (error) {
        console.error("deleteTask error:", error);
    }
}

export async function deleteTasksByCalendarId(
    calendarId
) {
    const tasks = getTasks().filter(
        (t) => t.calendarId === calendarId
    );

    await Promise.all(
        tasks.map(async (task) => {
            if (
                task.appwriteId &&
                typeof task.appwriteId === "string"
            ) {
                try {
                    await service.deleteTask(
                        task.appwriteId
                    );
                } catch (error) {
                    console.error(
                        "Cloud task delete failed:",
                        error
                    );
                }
            }
        })
    );

    store.dispatch(
        deleteTasksByCalendarIdAction(calendarId)
    );
}

export function bulkUpdateTasks(updatedTasks = []) {
    store.dispatch(bulkUpdateTasksAction(updatedTasks));
}

/*
======================================================
SYNC HELPERS
======================================================
*/

export function getPendingCalendars() {
    return getCalendars().filter(
        (c) =>
            !c.syncStatus ||
            c.syncStatus === "pending" ||
            c.syncStatus === "failed"
    );
}

export function getPendingTasks() {
    return getTasks().filter(
        (t) =>
            !t.syncStatus ||
            t.syncStatus === "pending" ||
            t.syncStatus === "failed"
    );
}

export function markCalendarSynced(id, appwriteId = null) {
    store.dispatch(markCalendarSyncedAction({ id, appwriteId }));
}

export function markTaskSynced(id, appwriteId = null) {
    store.dispatch(markTaskSyncedAction({ id, appwriteId }));
}

export function markCalendarFailed(id) {
    store.dispatch(markCalendarFailedAction(id));
}

export function markTaskFailed(id) {
    store.dispatch(markTaskFailedAction(id));
}

/*
======================================================
THEME (localStorage-only — not in Redux)
======================================================
*/

const THEME_KEY = "timeline_theme";

export function getTheme() {
    try {
        const theme = localStorage.getItem(THEME_KEY);
        return theme === "light" ? "light" : "dark";
    } catch {
        return "dark";
    }
}

export function setTheme(theme) {
    localStorage.setItem(
        THEME_KEY,
        theme === "light" ? "light" : "dark"
    );
}

export function toggleTheme() {
    const current = getTheme();
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
    return next;
}
