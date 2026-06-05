import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import AppRoutes from "./app/routes/appRoutes.jsx";
import { ThemeProvider } from "./app/providers/ThemeContext.jsx";

import authService from "@/appwrite/auth.js";
import { login, logout } from "@/store/AuthSlice.js";
import { setCalendars } from "@/store/calendarSlice.js";
import { setTasks } from "@/store/taskSlice.js";

import { bootstrapUserData } from "@/shared/utils/cloudBootstrap.js";
import {
    syncPendingCalendars,
    syncPendingTasks,
} from "@/shared/utils/syncService.js";
import {
    initAutoSync,
    destroyAutoSync,
} from "@/shared/utils/autoSyncManager.js";
import { cleanupOrphanTasks } from "./shared/utils/calendarUtils.js";

import Footer from "@/shared/components/Footer.jsx";

/*
======================================================
LOCALSTORAGE FALLBACK READERS

Only used when Appwrite is unreachable at startup
(offline / network error). Under normal conditions
data comes from cloudBootstrap.
======================================================
*/

function readCached(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export default function App() {

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {

        const initializeApp = async () => {
            try {

                const userData = await authService.getCurrentUser();

                if (userData) {

                    const userId = userData.$id;

                    /*
                    1. Set auth state first so the Redux middleware
                       writes subsequent state changes to the correct
                       user-scoped localStorage key.
                    */
                    dispatch(
                        login(JSON.parse(JSON.stringify(userData)))
                    );

                    /*
                    2. PRIMARY: fetch from Appwrite and hydrate Redux.
                       cloudBootstrap merges any unsynced local edits
                       so offline work is not lost.
                    */
                    let bootstrapped = false;

                    try {
                        await bootstrapUserData(userId);
                        bootstrapped = true;
                    } catch (bootstrapError) {
                        /*
                        3. FALLBACK: Appwrite unreachable (offline).
                           Restore from localStorage cache so the app
                           remains usable without a network connection.
                        */
                        console.warn(
                            "Appwrite unreachable — using local cache:",
                            bootstrapError.message || bootstrapError
                        );

                        const calendars = readCached(
                            `timeline_calendars_${userId}`
                        );
                        const tasks = readCached(
                            `timeline_tasks_${userId}`
                        );

                        dispatch(setCalendars(calendars));
                        dispatch(setTasks(tasks));
                    }

                    /*
                    4. Remove any tasks whose calendar was deleted.
                    */
                    cleanupOrphanTasks();

                    /*
                    5. Start background sync.
                    */
                    initAutoSync();

                    /*
                    6. If Appwrite was reachable, immediately flush
                       any pending (offline-created) items that the
                       merge brought in from local cache.
                    */
                    if (bootstrapped) {
                        try {
                            await syncPendingCalendars(userId);
                            await syncPendingTasks(userId);
                        } catch (syncError) {
                            console.warn("Initial sync failed:", syncError);
                        }
                    }

                } else {

                    /*
                    Not logged in — clear any previous session state.
                    */
                    dispatch(logout());
                }

            } catch (error) {

                console.error("App init error:", error);
                dispatch(logout());

            } finally {

                setLoading(false);
            }
        };

        initializeApp();

        return () => {
            destroyAutoSync();
        };

    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050816] overflow-hidden relative">

                <div className="absolute w-[500px] h-[500px] rounded-full bg-fuchsia-500/20 blur-[120px]" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-fuchsia-500/30 animate-pulse">
                        <i className="bi bi-stars text-white text-4xl"></i>
                    </div>

                    <h1 className="mt-8 text-4xl font-black tracking-tight text-white">
                        Timeline
                    </h1>

                    <p className="mt-3 text-white/50">
                        Restoring your workspace...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                    <div className="flex-1">
                        <AppRoutes />
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
