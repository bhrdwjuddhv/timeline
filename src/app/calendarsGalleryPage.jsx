import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { motion } from "motion/react";

import {
    createCalendar,
    deleteCalendar,
    getTasksByCalendarId,
} from "../shared/utils/storageUtils.js";

import { scheduleSync } from "@/shared/utils/autoSyncManager.js";

import { useTheme } from "./providers/ThemeContext.jsx";

import CreateCalendarModal from "@/features/calendar/modals/CreateCalendarModal.jsx";
import DeleteConfirmModal from "@/features/calendar/modals/DeleteConfirmModal.jsx";
import RenameCalendarModal from "@/features/calendar/modals/RenameCalendarModal.jsx";

export default function CalendarsGalleryPage() {

    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();

    /*
    Calendars come from Redux — component auto-updates
    on any calendar mutation without manual refreshCalendars().
    */
    const calendars = useSelector(
        (state) => state.calendars.calendars
    );

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState(null);

    /*
    =========================================
    HANDLERS
    =========================================
    */

    const handleCreate = useCallback((name) => {
        const calendar = createCalendar(name);
        scheduleSync();
        navigate(`/dashboard/calendar/${calendar.id}`);
    }, [navigate]);

    const handleOpenCalendar = useCallback((calendar) => {
        navigate(`/dashboard/calendar/${calendar.id}`);
    }, [navigate]);

    const openDeleteModal = useCallback((e, calendar) => {
        e.stopPropagation();
        setSelectedCalendar(calendar);
        setShowDeleteModal(true);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!selectedCalendar) return;
        await deleteCalendar(selectedCalendar.id);
        scheduleSync();
        setShowDeleteModal(false);
        setSelectedCalendar(null);
    }, [selectedCalendar]);

    const openRenameModal = useCallback((e, calendar) => {
        e.stopPropagation();
        setSelectedCalendar(calendar);
        setShowRenameModal(true);
    }, []);

    const handleRename = useCallback(() => {
        scheduleSync();
        setShowRenameModal(false);
        setSelectedCalendar(null);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex-1 w-full p-6 overflow-hidden"
        >

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25], x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] ${isDark ? "bg-fuchsia-500/10" : "bg-fuchsia-500/5"}`}
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2], x: [0, -40, 0], y: [0, 40, 0] }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className={`absolute bottom-[0%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] ${isDark ? "bg-cyan-500/10" : "bg-cyan-500/5"}`}
                />
            </div>

            {/* HEADER */}
            <div className="mb-14">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-5 backdrop-blur-xl ${isDark ? "border-white/10 bg-white/5 text-white/60" : "border-black/5 bg-white/60 text-slate-600"}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    Synced creative workspaces
                </div>

                <h1 className={`text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                    Creative Workspaces
                </h1>

                <p className={`mt-4 text-lg max-w-2xl leading-8 ${isDark ? "text-white/60" : "text-slate-600"}`}>
                    Organize campaigns, content systems, launches, and creative planning inside immersive visual calendars.
                </p>
            </div>

            {/* EMPTY STATE */}
            {calendars.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-28">
                    <motion.div
                        animate={{ y: [-12, 12, -12] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-36 h-36 flex items-center justify-center mb-10"
                    >
                        <div className="absolute inset-0 rounded-full blur-3xl opacity-50 bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
                        <div className={`relative z-10 w-20 h-20 rounded-[28px] flex items-center justify-center text-4xl shadow-2xl ${isDark ? "bg-white/10 text-white" : "bg-white/70 text-slate-900"}`}>
                            <i className="bi bi-stars"></i>
                        </div>
                    </motion.div>

                    <h2 className={`text-3xl font-black tracking-tight mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                        Your workspace is still empty
                    </h2>

                    <p className={`max-w-lg text-lg leading-8 mb-10 ${isDark ? "text-white/55" : "text-slate-600"}`}>
                        Start organizing your creative flow by creating your first cinematic planning workspace.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 shadow-2xl shadow-fuchsia-500/20"
                    >
                        <i className="bi bi-plus-lg mr-2"></i>
                        Create Workspace
                    </motion.button>
                </div>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {/* CREATE CARD */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(true)}
                        className={`relative min-h-[340px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-10 transition-all duration-300 ${isDark ? "border-white/15 bg-white/[0.03] hover:border-cyan-400 hover:bg-white/[0.05]" : "border-black/10 bg-black/[0.02] hover:border-cyan-500 hover:bg-black/[0.04]"}`}
                    >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 ${isDark ? "bg-white/10 text-white" : "bg-white text-slate-900 shadow-lg"}`}>
                            <i className="bi bi-plus-lg"></i>
                        </div>
                        <div className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Create Workspace
                        </div>
                    </motion.button>

                    {/* CALENDAR CARDS */}
                    {calendars.map((calendar) => {
                        const taskCount = getTasksByCalendarId(calendar.id).length;

                        return (
                            <motion.div
                                key={calendar.id}
                                whileHover={{ scale: 1.02, y: -4 }}
                                onClick={() => handleOpenCalendar(calendar)}
                                className={`group relative overflow-hidden cursor-pointer rounded-[32px] border backdrop-blur-2xl p-6 min-h-[340px] flex flex-col justify-between transition-all duration-300 ${isDark ? "border-white/10 bg-white/[0.03] hover:shadow-cyan-500/10" : "border-black/5 bg-white/80 hover:shadow-cyan-500/20"}`}
                            >
                                <div className="absolute -inset-20 opacity-0 group-hover:opacity-100 blur-[80px] transition-opacity duration-700 bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/20"></div>

                                <div className="relative">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-xl"
                                                style={{ background: `linear-gradient(135deg, ${calendar.color || "#d946ef"}, #22d3ee)` }}
                                            >
                                                <i className={`bi ${calendar.icon || "bi-calendar3"}`}></i>
                                            </div>

                                            <div>
                                                <h3 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                                                    {calendar.name}
                                                </h3>
                                                <div className={`mt-1 text-sm ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                                    {taskCount} tasks
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => openRenameModal(e, calendar)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-slate-700"}`}
                                            >
                                                <i className="bi bi-pencil-fill text-sm"></i>
                                            </button>

                                            <button
                                                onClick={(e) => openDeleteModal(e, calendar)}
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-red-500/20 hover:bg-red-500/40 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-500"}`}
                                            >
                                                <i className="bi bi-trash-fill text-sm"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <p className={`text-sm leading-7 ${isDark ? "text-white/55" : "text-slate-600"}`}>
                                        {calendar.description || "Visual workspace for content planning and creative organization."}
                                    </p>
                                </div>

                                {/* PREVIEW */}
                                <div className={`relative mt-8 rounded-3xl overflow-hidden aspect-[16/10] ${isDark ? "bg-black/40 border border-white/5" : "bg-slate-100/50 border border-black/5"}`}>
                                    <div
                                        className="absolute inset-0 opacity-20 blur-3xl"
                                        style={{ background: `linear-gradient(135deg, ${calendar.color || "#d946ef"}, #22d3ee)` }}
                                    />
                                    <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                        <div>
                                            <div className="w-1/3 h-2 rounded-full bg-current opacity-30 mb-3"></div>
                                            <div className="flex gap-2">
                                                <div className="w-12 h-6 rounded-lg bg-fuchsia-500/40"></div>
                                                <div className="w-8 h-6 rounded-lg bg-cyan-500/40"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="w-12 h-6 rounded-lg bg-orange-400/40"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* FOOTER */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div className={`flex items-center gap-2 text-sm ${isDark ? "text-white/40" : "text-slate-500"}`}>
                                        {calendar.syncStatus === "synced" ? (
                                            <>
                                                <i className="bi bi-cloud-check-fill text-emerald-400"></i>
                                                Synced
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-cloud-upload-fill text-amber-400"></i>
                                                Pending Sync
                                            </>
                                        )}
                                    </div>

                                    <button className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDark ? "bg-white/5 hover:bg-white/10 text-white" : "bg-black/[0.04] hover:bg-black/[0.08] text-slate-900"}`}>
                                        Open Workspace
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* MODALS */}
            <CreateCalendarModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCalendarCreated={handleCreate}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                calendarName={selectedCalendar?.name}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedCalendar(null);
                }}
                onConfirm={handleDelete}
            />

            <RenameCalendarModal
                isOpen={showRenameModal}
                calendar={selectedCalendar}
                onClose={() => {
                    setShowRenameModal(false);
                    setSelectedCalendar(null);
                }}
                onCalendarRenamed={handleRename}
            />
        </motion.div>
    );
}
