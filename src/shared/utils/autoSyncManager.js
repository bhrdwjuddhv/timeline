import store from "@/store/store.js";
import { setSyncState } from "@/store/calendarSlice.js";
import {
    syncPendingCalendars,
    syncPendingTasks,
} from "./syncService.js";

/*
======================================================
AUTO SYNC MANAGER
Handles background synchronization to Appwrite.

Schedule:
  - Debounced  : 5 s after last Redux state change
  - Periodic   : every 60 s
  - Immediate  : Save button, tab hidden,
                 window close, network reconnect
======================================================
*/

let debounceTimer = null;
let periodicTimer = null;
let isSyncing = false;

const DEBOUNCE_MS = 5_000;
const PERIODIC_MS = 60_000;

/*
------------------------------------------------------
Helpers
------------------------------------------------------
*/

function getUserId() {
    return store.getState().auth?.userData?.$id;
}

function hasPendingWork() {
    const { calendars } = store.getState().calendars;
    const { tasks } = store.getState().tasks;
    const pendingCal = calendars.some(
        (c) =>
            !c.syncStatus ||
            c.syncStatus === "pending" ||
            c.syncStatus === "failed"
    );
    const pendingTask = tasks.some(
        (t) =>
            !t.syncStatus ||
            t.syncStatus === "pending" ||
            t.syncStatus === "failed"
    );
    return pendingCal || pendingTask;
}

/*
------------------------------------------------------
Core sync
------------------------------------------------------
*/

async function performSync() {
    if (isSyncing) return;

    const userId = getUserId();
    if (!userId) return;

    if (!hasPendingWork()) return;

    try {
        isSyncing = true;
        store.dispatch(setSyncState("syncing"));

        await syncPendingCalendars(userId);
        await syncPendingTasks(userId);

        store.dispatch(setSyncState("synced"));

        /*
        Revert to idle after 3 s so toolbar
        doesn't show "Synced" indefinitely.
        */
        setTimeout(() => {
            const current =
                store.getState().calendars.syncState;
            if (current === "synced") {
                store.dispatch(setSyncState("idle"));
            }
        }, 3_000);

    } catch (error) {

        console.error("Auto sync failed:", error);
        store.dispatch(setSyncState("failed"));

    } finally {
        isSyncing = false;
    }
}

/*
------------------------------------------------------
Public API
------------------------------------------------------
*/

/**
 * Schedule a debounced sync (5 s after last call).
 * Call this after any user-driven data mutation.
 */
export function scheduleSync() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSync, DEBOUNCE_MS);

    /*
    Immediately update sync state to "pending"
    so the toolbar reflects unsynced changes.
    */
    const current = store.getState().calendars.syncState;
    if (current === "idle" || current === "synced") {
        store.dispatch(setSyncState("pending"));
    }
}

/**
 * Force an immediate sync and return the promise.
 * Used by the manual Save button and browser events.
 */
export function forceSyncNow() {
    if (debounceTimer) clearTimeout(debounceTimer);
    return performSync();
}

/**
 * Initialise periodic timers and browser event listeners.
 * Must be called once after the user is authenticated.
 */
export function initAutoSync() {
    /*
    Periodic sync every 60 s.
    */
    if (periodicTimer) clearInterval(periodicTimer);
    periodicTimer = setInterval(performSync, PERIODIC_MS);

    /*
    Sync when tab becomes hidden (user switches away / closes).
    */
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            forceSyncNow();
        }
    });

    /*
    Sync on network reconnect.
    */
    window.addEventListener("online", () => {
        forceSyncNow();
    });

    /*
    Best-effort sync on page unload.
    (sendBeacon is not viable here because Appwrite
     uses REST, so we fire-and-forget.)
    */
    window.addEventListener("beforeunload", () => {
        performSync();
    });
}

/**
 * Tear down timers (call on logout).
 */
export function destroyAutoSync() {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (periodicTimer) clearInterval(periodicTimer);
    debounceTimer = null;
    periodicTimer = null;
}
