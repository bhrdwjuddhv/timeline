import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    calendars: [],
    selectedCalendar: null,
    syncState: "idle",
    loading: false,
};

const calendarSlice = createSlice({
    name: "calendars",
    initialState,
    reducers: {

        setCalendars(state, action) {
            state.calendars = action.payload;
        },

        addCalendar(state, action) {
            state.calendars.push(action.payload);
        },

        updateCalendar(state, action) {
            const { id, updates } = action.payload;
            const idx = state.calendars.findIndex((c) => c.id === id);
            if (idx === -1) return;
            const prev = state.calendars[idx];
            state.calendars[idx] = {
                ...prev,
                ...updates,
                syncStatus:
                    updates.syncStatus ||
                    (prev.syncStatus === "synced" ? "pending" : prev.syncStatus) ||
                    "pending",
                updatedAt: Date.now(),
            };
        },

        deleteCalendar(state, action) {
            state.calendars = state.calendars.filter((c) => c.id !== action.payload);
        },

        setSelectedCalendar(state, action) {
            state.selectedCalendar = action.payload;
        },

        markCalendarPending(state, action) {
            const idx = state.calendars.findIndex((c) => c.id === action.payload);
            if (idx !== -1) state.calendars[idx].syncStatus = "pending";
        },

        markCalendarSynced(state, action) {
            const { id, appwriteId } = action.payload;
            const idx = state.calendars.findIndex((c) => c.id === id);
            if (idx === -1) return;
            state.calendars[idx].syncStatus = "synced";
            if (appwriteId) state.calendars[idx].appwriteId = appwriteId;
            state.calendars[idx].updatedAt = Date.now();
        },

        markCalendarFailed(state, action) {
            const idx = state.calendars.findIndex((c) => c.id === action.payload);
            if (idx !== -1) state.calendars[idx].syncStatus = "failed";
        },

        setSyncState(state, action) {
            state.syncState = action.payload;
        },

        setCalendarLoading(state, action) {
            state.loading = action.payload;
        },

        clearCalendars(state) {
            state.calendars = [];
            state.selectedCalendar = null;
            state.syncState = "idle";
        },
    },
});

export const {
    setCalendars,
    addCalendar,
    updateCalendar,
    deleteCalendar,
    setSelectedCalendar,
    markCalendarPending,
    markCalendarSynced,
    markCalendarFailed,
    setSyncState,
    setCalendarLoading,
    clearCalendars,
} = calendarSlice.actions;

export default calendarSlice.reducer;
