import { useMemo, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";

import Box from "../../../features/calendar/components/box.jsx";
import CalendarTaskModal from "../../../features/calendar/components/calendarTaskModal.jsx";

import {
    createTask,
    updateTask,
    deleteTask,
} from "../../utils/storageUtils.js";

import { scheduleSync } from "../../utils/autoSyncManager.js";

/*
======================================================
CALENDAR COMPONENT

Live view  : cells have a fixed 220px row height.
             When tasks overflow, a subtle vertical
             scrollbar appears inside the cell.

Export     : exportUtils.js temporarily removes the
             max-height / overflow constraints so that
             all tasks are visible in the screenshot.
======================================================
*/

export default memo(function Calendar({
    tasks = [],
    allTasks = [],
    setAllTasks,
    selectedTheme,
    calendarId,
    readOnly = false,
}) {

    const navigate = useNavigate();

    /*
    =========================
    MODAL STATE
    =========================
    */

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingTask, setEditingTask] = useState(null);

    /*
    =========================
    DRAG STATE
    =========================
    */

    const [draggedTask, setDraggedTask] = useState(null);

    /*
    =========================
    CURRENT DATE
    =========================
    */

    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    /*
    =========================
    DATE FORMATTER
    =========================
    */

    const formatDate = useCallback((date) => {
        const d = new Date(date);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    }, []);

    /*
    =========================
    DATE LOGIC
    =========================
    */

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    /*
    =========================
    SAVE TASK
    =========================
    */

    const handleSaveTask = useCallback(
        (task) => {
            if (readOnly) return;

            if (task.id) {
                updateTask(task.id, {
                    title: task.title,
                    socialMedia: task.socialMedia,
                    time: task.time,
                    date: formatDate(new Date(task.date)),
                    calendarId: task.calendarId,
                });
            } else {
                createTask(task.calendarId, {
                    title: task.title,
                    socialMedia: task.socialMedia,
                    time: task.time,
                    date: formatDate(new Date(task.date)),
                });
            }

            scheduleSync();
            setModalOpen(false);
        },
        [readOnly, formatDate]
    );

    /*
    =========================
    DELETE TASK
    =========================
    */

    const handleDeleteTask = useCallback(
        async (id) => {
            if (readOnly) return;

            await deleteTask(id);
            scheduleSync();
            setModalOpen(false);
        },
        [readOnly]
    );

    /*
    =========================
    DRAG START
    =========================
    */

    const handleDragStart = useCallback(
        (task) => {
            if (readOnly) return;
            setDraggedTask(task);
        },
        [readOnly]
    );

    /*
    =========================
    DROP TASK
    =========================
    */

    const handleDrop = useCallback(
        (date) => {
            if (readOnly || !draggedTask) return;

            updateTask(draggedTask.id, {
                date: formatDate(new Date(date)),
            });

            scheduleSync();
            setDraggedTask(null);
        },
        [readOnly, draggedTask, formatDate]
    );

    /*
    =========================
    TASK CLICK
    =========================
    */

    const handleTaskClick = useCallback(
        (task) => {
            if (readOnly && task.calendarId) {
                navigate(`/dashboard/calendar/${task.calendarId}`);
                return;
            }
            if (!readOnly) {
                setEditingTask(task);
                setModalOpen(true);
            }
        },
        [readOnly, navigate]
    );

    /*
    =========================
    MONTH LABELS
    =========================
    */

    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December",
    ];

    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    /*
    =========================
    CALENDAR DAYS
    =========================
    */

    const calendarDays = useMemo(() => {
        const days = [];

        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                currentMonth: false,
                date: formatDate(
                    new Date(year, month - 1, prevMonthLastDay - i)
                ),
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                day,
                currentMonth: true,
                date: formatDate(new Date(year, month, day)),
            });
        }

        while (days.length < 42) {
            const nextDay =
                days.length - (startDay + daysInMonth) + 1;
            days.push({
                day: nextDay,
                currentMonth: false,
                date: formatDate(
                    new Date(year, month + 1, nextDay)
                ),
            });
        }

        return days;
    }, [month, year, startDay, daysInMonth, prevMonthLastDay, formatDate]);

    /*
    =========================
    THEME
    =========================
    */

    const theme = selectedTheme || {};

    /*
    =========================
    MONTH NAVIGATION
    =========================
    */

    const nextMonth = useCallback(() => {
        setCurrentDate(new Date(year, month + 1, 1));
    }, [year, month]);

    const previousMonth = useCallback(() => {
        setCurrentDate(new Date(year, month - 1, 1));
    }, [year, month]);

    const todayString = formatDate(new Date());

    return (
        <>
            <div
                id="calendar-export-area"
                className={`
          relative isolate
          w-full
          rounded-[36px]
          border
          p-5 xl:p-8
          overflow-hidden

          ${theme.card || "bg-[#0f172a]"}
          ${theme.border || "border-white/10"}
          ${theme.text || "text-white"}
        `}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex gap-3">
                        <button
                            onClick={previousMonth}
                            className="
                w-14 h-14
                rounded-2xl hover:cursor-pointer
                border border-white/10
                bg-white/5 hover:bg-white/10
                transition-all
                flex items-center justify-center
              "
                        >
                            <i className="bi bi-skip-backward-fill" />
                        </button>

                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="
                w-14 h-14
                rounded-2xl hover:cursor-pointer
                border border-white/10
                bg-white/5 hover:bg-white/10
                transition-all
                flex items-center justify-center
              "
                        >
                            <i className="bi bi-house-fill" />
                        </button>
                    </div>

                    <h1 className="text-5xl font-black tracking-tight">
                        {monthNames[month]} {year}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            className="
                w-14 h-14
                rounded-2xl
                border border-white/10
                bg-white/5 hover:cursor-pointer
                flex items-center justify-center
              "
                        >
                            <i className="bi bi-calendar2-week-fill" />
                        </button>

                        <button
                            onClick={nextMonth}
                            className="
                w-14 h-14
                rounded-2xl
                border border-white/10
                bg-white/5 hover:cursor-pointer hover:bg-white/10
                transition-all
                flex items-center justify-center
              "
                        >
                            <i className="bi bi-skip-forward-fill" />
                        </button>
                    </div>
                </div>

                {/* WEEK DAYS */}
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="
                text-center text-sm
                font-black opacity-60 tracking-widest
              "
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* GRID — fixed 220px rows */}
                <div
                    className="
            grid
            grid-cols-7
            gap-4
            w-full
            auto-rows-[220px]
          "
                >
                    {calendarDays.map((calendarDay, index) => {
                        const dayTasks = tasks.filter(
                            (task) =>
                                formatDate(new Date(task.date)) ===
                                calendarDay.date
                        );

                        const isToday =
                            calendarDay.date === todayString;

                        return (
                            <div
                                key={index}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(calendarDay.date)}
                                className={`
                    group
                    relative
                    rounded-3xl
                    border
                    overflow-hidden
                    p-3
                    flex flex-col
                    transition-all
                    duration-300
                    hover:-translate-y-1

                    ${calendarDay.currentMonth ? "opacity-100" : "opacity-30"}

                    ${
                        isToday
                            ? "border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.2)]"
                            : "border-white/10"
                    }

                    ${draggedTask ? "hover:border-cyan-400/50" : ""}

                    ${theme.cell || "bg-white/[0.03]"}
                  `}
                            >
                                {/* ADD TASK BUTTON */}
                                {!readOnly && (
                                    <button
                                        onClick={() => {
                                            setSelectedDate(calendarDay.date);
                                            setEditingTask(null);
                                            setModalOpen(true);
                                        }}
                                        className="
                        absolute top-3 left-3
                        w-9 h-9
                        rounded-xl
                        bg-white/10 hover:bg-white/20
                        opacity-0 hover:cursor-pointer
                        group-hover:opacity-100
                        transition-all
                        flex items-center justify-center
                      "
                                    >
                                        <i className="bi bi-pencil-fill text-xs" />
                                    </button>
                                )}

                                {/* DATE NUMBER */}
                                <div className="flex justify-end mb-2">
                                    <div
                                        className={`
                        text-sm font-bold
                        ${
                            isToday
                                ? "bg-fuchsia-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                                : ""
                        }
                      `}
                                    >
                                        {calendarDay.day}
                                    </div>
                                </div>

                                {/*
                                  TASKS CONTAINER
                                  Live mode  : fixed max-height + overflow-y-auto → scrollbar
                                  Export mode: exportUtils removes max-height & overflow inline
                                */}
                                <div
                                    className="cell-tasks-container flex flex-col gap-2 overflow-y-auto flex-1"
                                    style={{ minHeight: 0 }}
                                >
                                    {dayTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            draggable={!readOnly}
                                            onDragStart={() =>
                                                handleDragStart(task)
                                            }
                                            onClick={() =>
                                                handleTaskClick(task)
                                            }
                                            className="cursor-grab active:cursor-grabbing shrink-0"
                                        >
                                            <Box
                                                title={task.title}
                                                socialMedia={task.socialMedia}
                                                time={task.time}
                                                theme={theme}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL */}
            {!readOnly && (
                <CalendarTaskModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    editingTask={editingTask}
                    selectedDate={selectedDate}
                    fixedCalendar={calendarId}
                />
            )}
        </>
    );
});
