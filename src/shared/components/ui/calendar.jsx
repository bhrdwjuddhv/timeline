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
import { taskCoversDate } from "../../utils/calendarUtils.js";

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

/*
======================================================
MULTI-DAY BAR GEOMETRY
Overlay bars are positioned with absolute px math
derived from the 7-column grid: gap-4 (16px) gutters
and fixed 220px rows.
======================================================
*/

const GRID_GAP = 16;                          // gap-4
const ROW_HEIGHT = 220;                        // auto-rows-[220px]
const ROW_STRIDE = ROW_HEIGHT + GRID_GAP;      // one grid row + gutter
const BAR_HEIGHT = 28;                          // reserved bar height
const LANE_GAP = 6;
const LANE_STRIDE = BAR_HEIGHT + LANE_GAP;      // vertical step per lane
const BAR_TOP = 48;                             // first lane offset from cell top

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
                    startDate: formatDate(new Date(task.startDate)),
                    endDate: task.endDate || "",
                    calendarId: task.calendarId,
                });
            } else {
                createTask(task.calendarId, {
                    title: task.title,
                    socialMedia: task.socialMedia,
                    time: task.time,
                    startDate: formatDate(new Date(task.startDate)),
                    endDate: task.endDate || "",
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

            const newStart = formatDate(new Date(date));
            const oldStart = draggedTask.startDate || "";
            const oldEnd = draggedTask.endDate || "";
            let newEnd = "";

            if (oldEnd && oldEnd !== oldStart && oldStart) {
                const span =
                    new Date(oldEnd).getTime() -
                    new Date(oldStart).getTime();
                newEnd = formatDate(
                    new Date(new Date(newStart).getTime() + span)
                );
            }

            updateTask(draggedTask.id, {
                startDate: newStart,
                endDate: newEnd,
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
    MULTI-DAY SPAN SEGMENTS
    One continuous bar per grid row for every task
    whose endDate extends past its startDate.
    =========================
    */

    const isMultiDay = useCallback(
        (t) => t.endDate && t.startDate && t.endDate > t.startDate,
        []
    );

    const { spanSegments, lanesPerRow } = useMemo(() => {
        const rowsMap = new Map();

        tasks.filter(isMultiDay).forEach((task) => {
            // contiguous visible slice covered by this task
            let firstIdx = -1;
            let lastIdx = -1;

            for (let i = 0; i < calendarDays.length; i++) {
                if (taskCoversDate(task, calendarDays[i].date)) {
                    if (firstIdx === -1) firstIdx = i;
                    lastIdx = i;
                }
            }

            if (firstIdx === -1) return;

            const startRow = Math.floor(firstIdx / 7);
            const endRow = Math.floor(lastIdx / 7);

            for (let r = startRow; r <= endRow; r++) {
                const rowStart = Math.max(firstIdx, r * 7);
                const rowEnd = Math.min(lastIdx, r * 7 + 6);

                const seg = {
                    task,
                    rowIndex: r,
                    colStart: rowStart % 7,
                    colEnd: rowEnd % 7,
                    isRangeStart:
                        rowStart === firstIdx &&
                        calendarDays[firstIdx].date === task.startDate,
                    isRangeEnd:
                        rowEnd === lastIdx &&
                        calendarDays[lastIdx].date === task.endDate,
                };

                if (!rowsMap.has(r)) rowsMap.set(r, []);
                rowsMap.get(r).push(seg);
            }
        });

        // greedy lane assignment so bars in a row never overlap
        const lanesPerRow = {};
        const spanSegments = [];

        rowsMap.forEach((segs, r) => {
            segs.sort((a, b) => a.colStart - b.colStart);

            const laneEnds = [];

            segs.forEach((seg) => {
                let lane = 0;
                while (
                    lane < laneEnds.length &&
                    laneEnds[lane] >= seg.colStart
                ) {
                    lane++;
                }
                seg.lane = lane;
                laneEnds[lane] = seg.colEnd;
                spanSegments.push(seg);
            });

            lanesPerRow[r] = laneEnds.length;
        });

        return { spanSegments, lanesPerRow };
    }, [tasks, calendarDays, isMultiDay]);

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
            relative
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
                                !isMultiDay(task) &&
                                taskCoversDate(task, calendarDay.date)
                        );

                        const rowLanes =
                            lanesPerRow[Math.floor(index / 7)] || 0;

                        const isToday =
                            calendarDay.date === todayString;

                        return (
                            <div
                                key={index}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => handleDrop(calendarDay.date)}
                                onClick={
                                    readOnly
                                        ? undefined
                                        : () => {
                                            setSelectedDate(calendarDay.date);
                                            setEditingTask(null);
                                            setModalOpen(true);
                                        }
                                }
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

                    ${readOnly ? "" : "cursor-pointer"}

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
                                    style={{
                                        minHeight: 0,
                                        paddingTop: rowLanes
                                            ? rowLanes * LANE_STRIDE
                                            : undefined,
                                    }}
                                >
                                    {dayTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            draggable={!readOnly}
                                            onDragStart={() =>
                                                handleDragStart(task)
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskClick(task);
                                            }}
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

                    {/*
                      MULTI-DAY OVERLAY
                      Bars stack on top of the grid, spanning cell
                      boundaries. pointer-events-none lets gap clicks
                      fall through to the cell create handler.
                    */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        data-span-overlay="true"
                    >
                        {spanSegments.map((seg) => {
                            const n = seg.colEnd - seg.colStart + 1;

                            const left = `calc((100% - ${6 * GRID_GAP}px) / 7 * ${seg.colStart} + ${GRID_GAP * seg.colStart}px)`;
                            const width = `calc((100% - ${6 * GRID_GAP}px) / 7 * ${n} + ${GRID_GAP * (n - 1)}px)`;

                            const barOffset =
                                BAR_TOP + seg.lane * LANE_STRIDE;

                            const top =
                                seg.rowIndex * ROW_STRIDE + barOffset;

                            return (
                                <div
                                    key={`${seg.task.id}-${seg.rowIndex}`}
                                    data-span-bar="true"
                                    data-row-index={seg.rowIndex}
                                    data-bar-offset={barOffset}
                                    draggable={!readOnly}
                                    onDragStart={() =>
                                        handleDragStart(seg.task)
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskClick(seg.task);
                                    }}
                                    style={{
                                        left,
                                        width,
                                        top: `${top}px`,
                                        height: `${BAR_HEIGHT}px`,
                                    }}
                                    className={`
                        absolute
                        pointer-events-auto
                        ${readOnly ? "" : "cursor-grab active:cursor-grabbing"}
                      `}
                                >
                                    <Box
                                        variant="span"
                                        title={seg.task.title}
                                        socialMedia={seg.task.socialMedia}
                                        isRangeStart={seg.isRangeStart}
                                        isRangeEnd={seg.isRangeEnd}
                                        theme={theme}
                                    />
                                </div>
                            );
                        })}
                    </div>
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
