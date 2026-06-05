import service from "@/appwrite/config.js";
import store from "@/store/store.js";
import { setCalendars } from "@/store/calendarSlice.js";
import { setTasks } from "@/store/taskSlice.js";

/*
======================================================
CLOUD BOOTSTRAP SERVICE

Appwrite → Redux hydration.

On login this is the ONLY authoritative source.
localStorage is treated as an offline cache to merge
pending-only changes that haven't reached Appwrite yet.

Architecture:
  1. Fetch all calendars from Appwrite (paginated)
  2. Fetch all tasks from Appwrite (paginated)
  3. Read localStorage for truly-offline items (pending, no appwriteId)
  4. Merge: Appwrite wins for synced items; local wins for unsynced
  5. Hydrate Redux

After this, the Redux middleware handles all subsequent
localStorage writes automatically.
======================================================
*/

/*
------------------------------------------------------
NORMALIZATION
Map Appwrite document → local Redux shape
------------------------------------------------------
*/

function normalizeCalendar(doc) {
    return {
        id: doc.localId || doc.$id,
        appwriteId: doc.$id,
        name: doc.name || "Untitled",
        theme: doc.theme || "midnight",
        icon: doc.icon || "bi-calendar3",
        shared: Boolean(doc.shared),
        syncStatus: "synced",
        createdAt: doc.$createdAt
            ? new Date(doc.$createdAt).getTime()
            : Date.now(),
        updatedAt: doc.$updatedAt
            ? new Date(doc.$updatedAt).getTime()
            : Date.now(),
    };
}

function normalizeTask(doc) {
    return {
        id: doc.localId || doc.$id,
        appwriteId: doc.$id,
        calendarId: doc.calendarId || "",
        title: doc.title || "",
        description: doc.description || "",
        completed: Boolean(doc.completed),
        /*
        These fields may not be in the Appwrite schema yet —
        fall back to safe defaults; the merge step below will
        layer in local values where they exist.
        */
        priority: doc.priority || "medium",
        date: doc.date || "",
        time: doc.time || "",
        socialMedia: doc.socialMedia || "instagram",
        column: doc.column || "todo",
        position: Number(doc.position) || 0,
        color: doc.color || "",
        syncStatus: "synced",
        createdAt: doc.$createdAt
            ? new Date(doc.$createdAt).getTime()
            : Date.now(),
        updatedAt: doc.$updatedAt
            ? new Date(doc.$updatedAt).getTime()
            : Date.now(),
    };
}

/*
------------------------------------------------------
LOCALSTORAGE HELPERS (cache read — one-time at startup)
------------------------------------------------------
*/

function readCached(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/*
------------------------------------------------------
MERGE STRATEGY

Priority rules:
  A. Appwrite record  → always included (source of truth)
  B. Local record that's pending AND newer than Appwrite
     → overrides the Appwrite version (user edited offline)
  C. Local record with no appwriteId (never synced)
     → added as pending (will sync on next auto-sync cycle)
  D. Local record with appwriteId that isn't in Appwrite
     → deleted from cloud on another device; do NOT resurrect
------------------------------------------------------
*/

function mergeCalendars(appwriteCalendars, localCalendars) {

    const appwriteById = new Map(
        appwriteCalendars.map((c) => [c.id, c])
    );

    const merged = appwriteCalendars.map((appCal) => {
        const local = localCalendars.find((l) => l.id === appCal.id);

        /*
        Rule B — local edit is pending and more recent.
        Keep local content but preserve the cloud appwriteId so
        the sync service issues an UPDATE, not a CREATE.
        */
        if (
            local &&
            (local.syncStatus === "pending" ||
                local.syncStatus === "failed") &&
            local.updatedAt > appCal.updatedAt
        ) {
            return {
                ...local,
                appwriteId: appCal.appwriteId,
            };
        }

        return appCal;
    });

    /*
    Rule C — calendars created offline, never reached Appwrite.
    */
    const purelyLocal = localCalendars.filter(
        (l) =>
            !l.appwriteId &&
            !appwriteById.has(l.id) &&
            (l.syncStatus === "pending" || l.syncStatus === "failed")
    );

    return [...merged, ...purelyLocal];
}

function mergeTasks(appwriteTasks, localTasks) {

    const appwriteById = new Map(
        appwriteTasks.map((t) => [t.id, t])
    );

    const merged = appwriteTasks.map((appTask) => {
        const local = localTasks.find((l) => l.id === appTask.id);

        /*
        Rule B — local edit is pending and more recent.
        */
        if (
            local &&
            (local.syncStatus === "pending" ||
                local.syncStatus === "failed") &&
            local.updatedAt > appTask.updatedAt
        ) {
            return {
                ...local,
                appwriteId: appTask.appwriteId,
            };
        }

        /*
        For synced Appwrite tasks, supplement with any
        local-only fields not yet in the Appwrite schema
        (priority, column, position, color).
        */
        if (local) {
            return {
                ...appTask,
                priority: local.priority || appTask.priority,
                column: local.column || appTask.column,
                position:
                    local.position !== undefined
                        ? local.position
                        : appTask.position,
                color: local.color || appTask.color,
            };
        }

        return appTask;
    });

    /*
    Rule C — tasks created offline, never reached Appwrite.
    */
    const purelyLocal = localTasks.filter(
        (l) =>
            !l.appwriteId &&
            !appwriteById.has(l.id) &&
            (l.syncStatus === "pending" || l.syncStatus === "failed")
    );

    return [...merged, ...purelyLocal];
}

/*
------------------------------------------------------
MAIN ENTRY POINT
Called once per login from App.jsx.
------------------------------------------------------
*/

export async function bootstrapUserData(userId) {

    /*
    Fetch calendars and tasks in parallel.
    Both methods use listAllDocuments pagination internally.
    */
    const [calendarResponse, taskResponse] = await Promise.all([
        service.getCalendars(userId),
        service.getTasksByUser(userId),
    ]);

    const appwriteCalendars = (
        calendarResponse?.documents || []
    ).map(normalizeCalendar);

    const appwriteTasks = (
        taskResponse?.documents || []
    ).map(normalizeTask);

    /*
    Read offline cache to recover any pending-only
    changes made since the last successful sync.
    */
    const localCalendars = readCached(`timeline_calendars_${userId}`);
    const localTasks = readCached(`timeline_tasks_${userId}`);

    const calendars = mergeCalendars(appwriteCalendars, localCalendars);
    const tasks = mergeTasks(appwriteTasks, localTasks);

    /*
    Hydrate Redux — the middleware will immediately write
    the merged state back to localStorage as the new cache.
    */
    store.dispatch(setCalendars(calendars));
    store.dispatch(setTasks(tasks));

    return { calendars, tasks };
}
