import service from "@/appwrite/config.js";

import {
    getPendingCalendars,
    getPendingTasks,
    getCalendarById,
    markCalendarSynced,
    markTaskSynced,
    markCalendarFailed,
    markTaskFailed,
} from "./storageUtils.js";

/*
==================================================
SYNC CALENDARS
Reads pending from Redux (via storageUtils),
marks synced/failed back into Redux.
==================================================
*/

export async function syncPendingCalendars(userId) {

    const pendingCalendars = getPendingCalendars();

    for (const calendar of pendingCalendars) {

        try {

            let response;

            const calendarPayload = {
                userId,
                localId: String(calendar.id),
                name: calendar.name,
                theme: calendar.theme || "midnight",
                icon: calendar.icon || "bi-calendar3",
                shared: Boolean(calendar.shared),
                syncStatus: "synced",
            };

            if (
                calendar.appwriteId &&
                typeof calendar.appwriteId === "string"
            ) {

                response = await service.updateCalendar(
                    calendar.appwriteId,
                    calendarPayload
                );

            } else {

                response = await service.createCalendar(calendarPayload);
            }

            /*
            Dispatches to Redux → middleware → localStorage
            */
            markCalendarSynced(calendar.id, response.$id);

        } catch (error) {

            console.error("Calendar sync failed:", error);

            markCalendarFailed(calendar.id);
        }
    }
}

/*
==================================================
SYNC TASKS
==================================================
*/

export async function syncPendingTasks(userId) {

    const pendingTasks = getPendingTasks();

    for (const task of pendingTasks) {

        try {

            const calendar = getCalendarById(task.calendarId);

            if (!calendar || !calendar.appwriteId) {
                console.warn(
                    "Skipping task sync until calendar syncs:",
                    task.id
                );
                continue;
            }

            const taskPayload = {
                userId,
                localId: String(task.id),
                calendarId: String(task.calendarId),
                title: task.title,
                description: task.description || "",
                completed: Boolean(task.completed),
                date: task.date || "",
                time: task.time || "",
                socialMedia: task.socialMedia || "instagram",
                syncStatus: "synced",
            };

            let response;

            if (
                task.appwriteId &&
                typeof task.appwriteId === "string"
            ) {

                response = await service.updateTask(
                    task.appwriteId,
                    taskPayload
                );

            } else {

                response = await service.createTask(
                    taskPayload
                );
            }

            markTaskSynced(task.id, response.$id);

        } catch (error) {

            console.error("Task sync failed:", error);

            markTaskFailed(task.id);
        }
    }
}
