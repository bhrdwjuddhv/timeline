import {
    useState,
    useMemo,
    useEffect,
    useCallback,
} from "react";

import {
    useParams,
    Navigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { motion } from "motion/react";

import Calendar from "../shared/components/ui/calendar.jsx";
import FloatingToolbar from "../features/dashboard/components/floatingToolbar.jsx";

import authService from "@/appwrite/auth.js";
import service from "@/appwrite/config.js";

import {
    updateCalendar,
} from "../shared/utils/storageUtils.js";

import {
    setTasks,
} from "@/store/taskSlice.js";

import {
    getCalendarTheme,
    setCalendarTheme,
} from "../shared/utils/themeUtils.js";

import {
    downloadCalendarAsPNG,
    downloadCalendarAsPDF,
} from "../shared/utils/exportUtils.js";


import {
    forceSyncNow,
} from "@/shared/utils/autoSyncManager.js";

import { Permission, Role } from "appwrite";

export default function BrandCalendarPage({
    readOnly = false,
}) {

    const { calendarId } = useParams();
    const dispatch = useDispatch();

    /*
    =========================================
    USER
    =========================================
    */

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!readOnly) {
            authService
                .getCurrentUser()
                .then(setUserData)
                .catch(() => setUserData(null));
        }
    }, [readOnly]);

    /*
    =========================================
    REDUX STATE
    =========================================
    */

    const allTasks = useSelector(
        (state) => state.tasks.tasks
    );

    const syncState = useSelector(
        (state) => state.calendars.syncState
    );

    /*
    Local calendar — auto-updates when Redux state changes.
    */
    const localCalendar = useSelector((state) =>
        state.calendars.calendars.find((c) => c.id === calendarId)
    );

    /*
    =========================================
    SHARED MODE
    =========================================
    */

    const [sharedCalendar, setSharedCalendar] = useState(null);
    const [sharedTasks, setSharedTasks] = useState([]);
    const [loadingShared, setLoadingShared] = useState(readOnly);

    useEffect(() => {
        if (!readOnly) return;

        const loadShared = async () => {
            try {
                setLoadingShared(true);

                const calendarDoc =
                    await service.getSharedCalendar(calendarId);

                if (!calendarDoc) {
                    setSharedCalendar(null);
                    return;
                }

                const normalizedCalendar = {
                    ...calendarDoc,
                    id: calendarDoc.localId || calendarDoc.id,
                    name: calendarDoc.name || "Shared Calendar",
                };

                setSharedCalendar(normalizedCalendar);

                const tasksResponse =
                    await service.getSharedTasks(
                        normalizedCalendar.localId
                    );

                setSharedTasks(
                    tasksResponse?.documents || []
                );
            } catch (error) {
                console.error("Failed loading shared calendar", error);
            } finally {
                setLoadingShared(false);
            }
        };

        loadShared();
    }, [calendarId, readOnly]);

    /*
    =========================================
    ACTIVE CALENDAR
    =========================================
    */

    const calendar = readOnly ? sharedCalendar : localCalendar;

    /*
    =========================================
    TASKS FILTER
    =========================================
    */

    const localCalendarTasks = useMemo(
        () =>
            allTasks.filter((task) => {
                if (task.calendarId) {
                    return task.calendarId === calendarId;
                }
                if (task.calendarName) {
                    return task.calendarName === calendarId;
                }
                return false;
            }),
        [allTasks, calendarId]
    );

    const calendarTasks = readOnly
        ? sharedTasks
        : localCalendarTasks;

    /*
    =========================================
    MIGRATE OLD TASKS (calendarName → calendarId)
    =========================================
    */

    useEffect(() => {
        const migrated = allTasks.map((task) => {
            if (task.calendarName && !task.calendarId) {
                return { ...task, calendarId: task.calendarName };
            }
            return task;
        });

        const changed =
            JSON.stringify(migrated) !== JSON.stringify(allTasks);

        if (changed) {
            dispatch(setTasks(migrated));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /*
    =========================================
    THEME
    =========================================
    */

    const [selectedTheme, setSelectedTheme] = useState(
        () => getCalendarTheme(calendarId)
    );

    useEffect(() => {
        setSelectedTheme(getCalendarTheme(calendarId));
    }, [calendarId]);

    const handleThemeChange = useCallback(
        (themeName) => {
            setCalendarTheme(calendarId, themeName);
            setSelectedTheme(getCalendarTheme(calendarId));
        },
        [calendarId]
    );

    /*
    =========================================
    EXPORTS
    =========================================
    */

    const exportName =
        calendar?.name
            ?.trim()
            ?.replace(/\s+/g, "-")
            ?.toLowerCase() || "timeline-calendar";

    const handleDownloadPNG = useCallback(() => {
        downloadCalendarAsPNG("calendar-export-area", exportName);
    }, [exportName]);

    const handleDownloadPDF = useCallback(() => {
        downloadCalendarAsPDF("calendar-export-area", exportName);
    }, [exportName]);

    /*
    =========================================
    SAVE + SYNC
    =========================================
    */

    const [saveState, setSaveState] = useState("idle");

    const handleSave = useCallback(async () => {
        if (!userData?.$id) return;

        try {
            setSaveState("saving");
            await forceSyncNow();
            setSaveState("saved");
            setTimeout(() => setSaveState("idle"), 2000);
        } catch (error) {
            console.error("Save failed:", error);
            setSaveState("idle");
        }
    }, [userData]);

    /*
    =========================================
    SHARE CALENDAR
    =========================================
    */

    const handleShare = useCallback(async () => {
        try {
            if (calendar?.$id) {
                await service.updateCalendar(
                    calendar.$id,
                    { shared: true },
                    [
                        Permission.read(Role.any()),
                        Permission.update(Role.users()),
                        Permission.delete(Role.users()),
                    ]
                );
            }

            updateCalendar(calendarId, { shared: true });
        } catch (error) {
            console.error("Share failed:", error);
        }
    }, [calendar, calendarId]);

    /*
    =========================================
    DERIVED SAVE STATE
    Reconcile manual saveState with Redux syncState
    so the toolbar always reflects real status.
    =========================================
    */

    const effectiveSaveState = useMemo(() => {
        if (saveState === "saving") return "saving";
        if (saveState === "saved") return "saved";
        if (syncState === "syncing") return "saving";
        if (syncState === "pending") return "pending";
        return "idle";
    }, [saveState, syncState]);

    /*
    =========================================
    LOADING SHARED
    =========================================
    */

    if (loadingShared) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading shared calendar...
            </div>
        );
    }

    /*
    =========================================
    INVALID CALENDAR
    =========================================
    */

    if (!calendar) {
        if (readOnly) {
            return (
                <div className="relative min-h-screen overflow-hidden bg-[#050816] flex items-center justify-center px-6">
                    <div className="absolute top-[-200px] left-[-120px] w-[700px] h-[700px] rounded-full bg-fuchsia-500/20 blur-[150px]" />
                    <div className="absolute bottom-[-200px] right-[-120px] w-[700px] h-[700px] rounded-full bg-cyan-500/20 blur-[150px]" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 w-full max-w-xl rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-12 text-center shadow-2xl"
                    >
                        <div className="w-28 h-28 mx-auto rounded-[32px] bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-fuchsia-500/30">
                            <span className="text-5xl">📅</span>
                        </div>

                        <h1 className="mt-10 text-4xl font-black text-white">
                            Shared calendar not found
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-white/60">
                            This shared calendar may have been deleted or the link is invalid.
                        </p>

                        <button
                            onClick={() => { window.location.href = "/"; }}
                            className="mt-10 px-10 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-semibold shadow-xl shadow-fuchsia-500/30 hover:scale-105 transition-all"
                        >
                            Go Home
                        </button>
                    </motion.div>
                </div>
            );
        }

        return <Navigate to="/dashboard/gallery" replace />;
    }

    /*
    =========================================
    UI
    =========================================
    */

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative w-full"
        >
            <div className="flex flex-col gap-6 w-full">

                {/* TOOLBAR */}
                <FloatingToolbar
                    title={calendar.name}
                    calendar={calendar}
                    calendarId={calendarId}
                    selectedThemeName={selectedTheme?.name}
                    onThemeChange={handleThemeChange}
                    onDownloadPNG={handleDownloadPNG}
                    onDownloadPDF={handleDownloadPDF}
                    onSave={handleSave}
                    onShare={handleShare}
                    saveState={effectiveSaveState}
                    taskCount={calendarTasks.length}
                />

                {/* CALENDAR */}
                <Calendar
                    tasks={calendarTasks}
                    allTasks={allTasks}
                    setAllTasks={() => {}}
                    calendar={calendar}
                    calendarId={calendarId}
                    selectedTheme={selectedTheme}
                    readOnly={readOnly}
                />
            </div>
        </motion.div>
    );
}
