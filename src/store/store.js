import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/store/AuthSlice.js";
import calendarReducer from "@/store/calendarSlice.js";
import taskReducer from "@/store/taskSlice.js";

/*
======================================================
LOCALSTORAGE MIDDLEWARE
Persists calendars and tasks after every Redux mutation.
Auth state is never persisted here — Appwrite session
handles authentication.
======================================================
*/

function getUserId(state) {
    return state.auth?.userData?.$id || "guest";
}

const localStorageMiddleware =
    (storeAPI) => (next) => (action) => {

        const result = next(action);

        const actionType = action.type;

        /*
        Skip loading/sync metadata actions to avoid
        redundant localStorage writes that carry no data.
        */
        const skipActions = new Set([
            "calendars/setCalendarLoading",
            "calendars/setSyncState",
            "tasks/setTaskLoading",
        ]);

        if (skipActions.has(actionType)) {
            return result;
        }

        const state = storeAPI.getState();
        const userId = getUserId(state);

        if (actionType.startsWith("calendars/")) {
            try {
                localStorage.setItem(
                    `timeline_calendars_${userId}`,
                    JSON.stringify(state.calendars.calendars)
                );
            } catch (e) {
                console.error("Failed to persist calendars:", e);
            }
        }

        if (actionType.startsWith("tasks/")) {
            try {
                localStorage.setItem(
                    `timeline_tasks_${userId}`,
                    JSON.stringify(state.tasks.tasks)
                );
            } catch (e) {
                console.error("Failed to persist tasks:", e);
            }
        }

        return result;
    };

const store = configureStore({
    reducer: {
        auth: authSlice,
        calendars: calendarReducer,
        tasks: taskReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(localStorageMiddleware),
});

export default store;
