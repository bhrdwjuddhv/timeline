import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: false,
    syncState: "idle",
};

const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {

        setTasks(state, action) {
            state.tasks = action.payload;
        },

        addTask(state, action) {
            state.tasks.push(action.payload);
        },

        updateTask(state, action) {
            const { id, updates } = action.payload;
            const idx = state.tasks.findIndex((t) => t.id === id);
            if (idx === -1) return;
            const prev = state.tasks[idx];
            state.tasks[idx] = {
                ...prev,
                ...updates,
                syncStatus:
                    updates.syncStatus ||
                    (prev.syncStatus === "synced" ? "pending" : prev.syncStatus) ||
                    "pending",
                updatedAt: Date.now(),
            };
        },

        deleteTask(state, action) {
            state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        },

        deleteTasksByCalendarId(state, action) {
            state.tasks = state.tasks.filter(
                (t) => t.calendarId !== action.payload
            );
        },

        bulkUpdateTasks(state, action) {
            const updatedMap = new Map(
                action.payload.map((t) => [t.id, t])
            );
            state.tasks = state.tasks.map((task) => {
                const updated = updatedMap.get(task.id);
                if (!updated) return task;
                return {
                    ...task,
                    ...updated,
                    syncStatus:
                        updated.syncStatus ||
                        (task.syncStatus === "synced" ? "pending" : task.syncStatus) ||
                        "pending",
                    updatedAt: Date.now(),
                };
            });
        },

        markTaskPending(state, action) {
            const idx = state.tasks.findIndex((t) => t.id === action.payload);
            if (idx !== -1) state.tasks[idx].syncStatus = "pending";
        },

        markTaskSynced(state, action) {
            const { id, appwriteId } = action.payload;
            const idx = state.tasks.findIndex((t) => t.id === id);
            if (idx === -1) return;
            state.tasks[idx].syncStatus = "synced";
            if (appwriteId) state.tasks[idx].appwriteId = appwriteId;
            state.tasks[idx].updatedAt = Date.now();
        },

        markTaskFailed(state, action) {
            const idx = state.tasks.findIndex((t) => t.id === action.payload);
            if (idx !== -1) state.tasks[idx].syncStatus = "failed";
        },

        setTaskLoading(state, action) {
            state.loading = action.payload;
        },

        clearTasks(state) {
            state.tasks = [];
        },
    },
});

export const {
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasksByCalendarId,
    bulkUpdateTasks,
    markTaskPending,
    markTaskSynced,
    markTaskFailed,
    setTaskLoading,
    clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
