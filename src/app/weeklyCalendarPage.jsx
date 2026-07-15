import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";

import { useTheme } from "./providers/ThemeContext.jsx";

import {
  formatDate,
  taskCoversDate,
} from "../shared/utils/calendarUtils.js";

import {
  updateTask,
  deleteTask,
} from "../shared/utils/storageUtils.js";

import { scheduleSync } from "../shared/utils/autoSyncManager.js";

import Box from "../features/calendar/components/box.jsx";
import CalendarTaskModal from "../features/calendar/components/calendarTaskModal.jsx";

/*
======================================================
WEEKLY CALENDAR — global, all calendars

Range   : yesterday, today, then the next 6 days
          (today − 1 → today + 6). 8 columns.

Rows    : an all-day band (untimed + multi-day bars)
          on top of a 24-hour time grid. Hour range is
          the full 00:00–23:00, the grid scrolls
          vertically; on narrow widths it scrolls
          horizontally instead of squashing.
======================================================
*/

const GRID_TEMPLATE = "64px repeat(8, minmax(130px, 1fr))";

const HOUR_ROW = 64;   // px per hour
const BAR_H = 26;      // multi-day bar height
const LANE_GAP = 4;
const LANE_STRIDE = BAR_H + LANE_GAP;
const BAR_TOP = 4;     // first lane offset in the all-day band

const isMultiDay = (t) =>
    t.endDate && t.startDate && t.endDate > t.startDate;

export default function WeeklyCalendarPage() {

  /*
  =========================================
  THEME
  =========================================
  */

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const border = isDark ? "border-white/10" : "border-black/5";
  const muted = isDark ? "text-white/40" : "text-slate-400";

  /* Minimal theme object for Box (platform colours are
     internal to Box; only text/background adapt here). */
  const boxTheme = {
    text: isDark ? "text-white" : "text-slate-900",
    taskGradient: isDark
        ? "bg-white/10 border-white/20"
        : "bg-black/[0.03] border-black/10",
  };

  /*
  =========================================
  DATA (Redux)
  =========================================
  */

  const tasks = useSelector((state) => state.tasks.tasks);
  const calendars = useSelector((state) => state.calendars.calendars);

  const calendarName = (id) =>
      calendars.find((c) => c.id === id)?.name || "Untitled";

  /*
  =========================================
  RANGE — yesterday → today + 6
  =========================================
  */

  const todayStr = formatDate(new Date());

  const days = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() - 1 + i);
      return d;
    });
  }, [todayStr]);

  const dayStrs = useMemo(
      () => days.map(formatDate),
      [days]
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);

  /*
  =========================================
  BUCKETS
  =========================================
  */

  // Multi-day tasks → all-day bars, split into lanes
  const { bars, lanes } = useMemo(() => {
    const segs = [];

    tasks.filter(isMultiDay).forEach((task) => {
      let firstCol = -1;
      let lastCol = -1;

      dayStrs.forEach((ds, i) => {
        if (taskCoversDate(task, ds)) {
          if (firstCol === -1) firstCol = i;
          lastCol = i;
        }
      });

      if (firstCol === -1) return;

      segs.push({
        task,
        colStart: firstCol,
        colEnd: lastCol,
        isRangeStart: dayStrs[firstCol] === task.startDate,
        isRangeEnd:
            dayStrs[lastCol] === (task.endDate || task.startDate),
      });
    });

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
    });

    return { bars: segs, lanes: laneEnds.length };
  }, [tasks, dayStrs]);

  // Single-day, untimed → all-day column chips
  const untimedByCol = useMemo(() => {
    const cols = Array.from({ length: 8 }, () => []);

    tasks.forEach((task) => {
      if (isMultiDay(task) || task.time) return;
      dayStrs.forEach((ds, i) => {
        if (taskCoversDate(task, ds)) cols[i].push(task);
      });
    });

    return cols;
  }, [tasks, dayStrs]);

  // Single-day, timed → time grid
  const timedByCol = useMemo(() => {
    const cols = Array.from({ length: 8 }, () => []);

    tasks.forEach((task) => {
      if (isMultiDay(task) || !task.time) return;
      dayStrs.forEach((ds, i) => {
        if (taskCoversDate(task, ds)) cols[i].push(task);
      });
    });

    return cols;
  }, [tasks, dayStrs]);

  const hasTasks = useMemo(
      () =>
          tasks.some((task) =>
              dayStrs.some((ds) => taskCoversDate(task, ds))
          ),
      [tasks, dayStrs]
  );

  /*
  =========================================
  MODAL — edit / delete only
  =========================================
  */

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (task) => {
    if (task.id) {
      updateTask(task.id, {
        title: task.title,
        socialMedia: task.socialMedia,
        time: task.time,
        startDate: task.startDate,
        endDate: task.endDate || "",
        calendarId: task.calendarId,
      });
    }
    scheduleSync();
    setModalOpen(false);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    scheduleSync();
    setModalOpen(false);
  };

  const allDayMinHeight = lanes
      ? BAR_TOP + lanes * LANE_STRIDE + 40
      : 64;

  const allDayPadTop = lanes
      ? BAR_TOP + lanes * LANE_STRIDE
      : 8;

  /*
  =========================================
  TASK CHIP — Box + calendar name
  =========================================
  */

  const Chip = ({ task, positioned }) => (
      <div
          onClick={() => handleTaskClick(task)}
          className={`cursor-pointer ${positioned ? "px-1" : ""}`}
      >
        <Box
            title={task.title}
            socialMedia={task.socialMedia}
            time={task.time}
            theme={boxTheme}
        />
        <div
            className={`
          mt-1
          px-1
          flex
          items-center
          gap-1
          truncate
          text-[11px]
          ${isDark ? "text-white/40" : "text-slate-500"}
        `}
        >
          <i className="bi bi-calendar3 shrink-0" />
          <span className="truncate">
            {calendarName(task.calendarId)}
          </span>
        </div>
      </div>
  );

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
          className="relative flex-1 w-full"
      >

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-10">

          <div
              className={`
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            border
            mb-5
            ${
                  isDark
                      ? "border-white/10 bg-white/5 text-white/60"
                      : "border-black/5 bg-white/70 text-slate-600"
              }
          `}
          >
            <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></div>
            Weekly timeline
          </div>

          <h1
              className={`
            text-5xl
            font-black
            tracking-tight
            mb-4
            ${isDark ? "text-white" : "text-slate-900"}
          `}
          >
            This Week
          </h1>

          <p
              className={`
            text-lg
            ${isDark ? "text-white/60" : "text-slate-600"}
          `}
          >
            {days[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
            {" – "}
            {days[7].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* ========================================= */}
        {/* EMPTY STATE */}
        {/* ========================================= */}

        {!hasTasks ? (

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
              flex
              flex-col
              items-center
              justify-center
              py-24
              rounded-2xl
              border
              ${
                    isDark
                        ? "border-white/[0.07] bg-white/[0.02]"
                        : "border-black/[0.07] bg-black/[0.02]"
                }
            `}
            >
              <div
                  className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-2xl
                mb-4
                ${
                      isDark
                          ? "bg-white/5 text-white/30"
                          : "bg-black/5 text-slate-400"
                  }
              `}
              >
                <i className="bi bi-calendar-week"></i>
              </div>

              <h2
                  className={`
                text-lg
                font-semibold
                mb-1
                ${isDark ? "text-white" : "text-slate-900"}
              `}
              >
                Nothing planned this week
              </h2>

              <p
                  className={`
                text-sm
                ${isDark ? "text-white/40" : "text-slate-500"}
              `}
              >
                Tasks from yesterday through the next six days will appear here.
              </p>
            </motion.div>

        ) : (

            <div
                className={`
              rounded-[36px]
              border
              backdrop-blur-3xl
              shadow-2xl
              overflow-auto
              max-h-[75vh]
              ${
                    isDark
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-white/80 border-black/5"
                }
            `}
            >

              {/* ================= DAY HEADER ================= */}
              <div
                  className={`
                sticky
                top-0
                z-20 rounded-full
                backdrop-blur-3xl
                border-b
                ${border}
                ${isDark ? "bg-slate-900/90" : "bg-white/90"}
              `}
                  style={{
                    display: "grid",
                    gridTemplateColumns: GRID_TEMPLATE,
                  }}
              >

                {/* corner */}
                <div className="w-16" />

                {days.map((d, i) => {
                  const isToday = dayStrs[i] === todayStr;

                  return (
                      <div
                          key={i}
                          className={`
                        border-l
                        ${border}
                        px-3
                        py-4
                        text-center
                      `}
                      >
                        <div
                            className={`
                          text-xs
                          font-black
                          uppercase
                          tracking-widest
                          ${
                                isToday
                                    ? "text-fuchsia-400"
                                    : muted
                            }
                        `}
                        >
                          {d.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>

                        <div
                            className={`
                          mx-auto
                          mt-1.5
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          text-xl
                          font-black
                          ${
                                isToday
                                    ? "rounded-full bg-fuchsia-500 text-white"
                                    : isDark
                                        ? "text-white"
                                        : "text-slate-900"
                            }
                        `}
                        >
                          {d.getDate()}
                        </div>
                      </div>
                  );
                })}
              </div>

              {/* ================= ALL-DAY BAND ================= */}
              <div
                  className={`border-b ${border}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: GRID_TEMPLATE,
                  }}
              >

                {/* gutter label */}
                <div className="w-16 flex items-start justify-end pr-2  pt-2">
                  <span
                      className={`
                    text-[10px]
                    font-black
                    uppercase
                    tracking-widest
                    ${muted}
                  `}
                  >
                    All-day
                  </span>
                </div>

                {/* content — 8 columns + bar overlay */}
                <div
                    className="relative"
                    style={{
                      gridColumn: "2 / -1",
                      minHeight: allDayMinHeight,
                    }}
                >

                  {/* untimed single-day chips */}
                  <div
                      className="grid h-full"
                      style={{
                        gridTemplateColumns: "repeat(8, 1fr)",
                      }}
                  >
                    {untimedByCol.map((colTasks, i) => (
                        <div
                            key={i}
                            className={`border-l ${border} p-2 flex flex-col gap-2`}
                            style={{ paddingTop: allDayPadTop }}
                        >
                          {colTasks.map((task) => (
                              <Chip key={task.id} task={task} />
                          ))}
                        </div>
                    ))}
                  </div>

                  {/* multi-day bars */}
                  <div className="absolute inset-0 pointer-events-none">
                    {bars.map((seg) => {
                      const n = seg.colEnd - seg.colStart + 1;

                      return (
                          <div
                              key={seg.task.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick(seg.task);
                              }}
                              style={{
                                left: `${(seg.colStart / 8) * 100}%`,
                                width: `${(n / 8) * 100}%`,
                                top: `${BAR_TOP + seg.lane * LANE_STRIDE}px`,
                                height: `${BAR_H}px`,
                              }}
                              className="absolute pointer-events-auto cursor-pointer px-1"
                          >
                            <Box
                                variant="span"
                                title={seg.task.title}
                                socialMedia={seg.task.socialMedia}
                                isRangeStart={seg.isRangeStart}
                                isRangeEnd={seg.isRangeEnd}
                                theme={boxTheme}
                            />
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ================= TIME GRID ================= */}
              <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: GRID_TEMPLATE,
                  }}
              >

                {/* hour gutter */}
                <div className="w-16 flex flex-col">
                  {hours.map((h) => (
                      <div
                          key={h}
                          style={{ height: HOUR_ROW }}
                          className={`
                        pr-2
                        text-right
                        text-xs
                        font-bold
                        ${muted}
                      `}
                      >
                        {`${h}`.padStart(2, "0")}:00
                      </div>
                  ))}
                </div>

                {/* content — 8 day columns */}
                <div
                    className="relative"
                    style={{
                      gridColumn: "2 / -1",
                      height: hours.length * HOUR_ROW,
                    }}
                >

                  {/* column + hour gridlines */}
                  <div
                      className="absolute inset-0 grid"
                      style={{
                        gridTemplateColumns: "repeat(8, 1fr)",
                      }}
                  >
                    {days.map((_, i) => (
                        <div key={i} className={`border-l ${border}`}>
                          {hours.map((h) => (
                              <div
                                  key={h}
                                  style={{ height: HOUR_ROW }}
                                  className={`border-t ${border}`}
                              />
                          ))}
                        </div>
                    ))}
                  </div>

                  {/* timed tasks */}
                  {days.map((_, i) =>
                      timedByCol[i].map((task) => {
                        const [hh, mm] = task.time
                            .split(":")
                            .map(Number);

                        const top =
                            (hh + (mm || 0) / 60) * HOUR_ROW;

                        return (
                            <div
                                key={task.id}
                                style={{
                                  position: "absolute",
                                  left: `${(i / 8) * 100}%`,
                                  width: `${(1 / 8) * 100}%`,
                                  top,
                                }}
                            >
                              <Chip task={task} positioned />
                            </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
        )}

        {/* ========================================= */}
        {/* MODAL */}
        {/* ========================================= */}

        <CalendarTaskModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            editingTask={editingTask}
            selectedDate={editingTask?.startDate}
            fixedCalendar={
              editingTask
                  ? {
                    id: editingTask.calendarId,
                    name: calendarName(editingTask.calendarId),
                  }
                  : null
            }
        />
      </motion.div>
  );
}
