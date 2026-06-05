import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { getTasks, getCalendars } from "../../../shared/utils/storageUtils.js";
import { useTheme } from "../../../app/providers/ThemeContext.jsx";
import { useMemo } from "react";

export default function DailyCalendar() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tasks = useMemo(() => getTasks(), []);
  const calendars = useMemo(() => getCalendars(), []);

  const today = new Date().toLocaleDateString("en-CA");

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todaysTasks = useMemo(
    () => tasks.filter((task) => task.date === today),
    [tasks, today]
  );

  // Group by hour; tasks without a time go into a separate "unscheduled" bucket
  const { scheduled, unscheduled } = useMemo(() => {
    const byHour = {};
    const noTime = [];

    todaysTasks.forEach((task) => {
      if (!task.time) {
        noTime.push(task);
        return;
      }
      const hour = parseInt(task.time.split(":")[0], 10);
      if (!byHour[hour]) byHour[hour] = [];
      byHour[hour].push(task);
    });

    // Only keep hours that have tasks, sorted ascending
    const sorted = Object.entries(byHour)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([hour, items]) => ({ hour: Number(hour), items }));

    return { scheduled: sorted, unscheduled: noTime };
  }, [todaysTasks]);

  const getCalendarName = (calendarId) => {
    const cal = calendars.find((c) => c.id === calendarId);
    return cal?.name ?? "Unknown";
  };

  const formatHour = (h) => {
    const suffix = h >= 12 ? "PM" : "AM";
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${suffix}`;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
          Today
        </h1>
        <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
          {todayLabel} · {todaysTasks.length} task{todaysTasks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* EMPTY STATE */}
      {todaysTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col items-center justify-center py-24 rounded-2xl border ${
            isDark ? "border-white/[0.07] bg-white/[0.02]" : "border-black/[0.07] bg-black/[0.02]"
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 ${
            isDark ? "bg-white/5 text-white/30" : "bg-black/5 text-slate-400"
          }`}>
            <i className="bi bi-calendar-check"></i>
          </div>
          <h2 className={`text-lg font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            Nothing scheduled today
          </h2>
          <p className={`text-sm ${isDark ? "text-white/40" : "text-slate-500"}`}>
            Tasks with today's date will appear here.
          </p>
        </motion.div>
      )}

      {/* SCHEDULED TASKS */}
      {scheduled.length > 0 && (
        <div className="space-y-3 mb-6">
          {scheduled.map(({ hour, items }) => (
            <motion.div
              key={hour}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[80px_1fr] gap-4 items-start"
            >
              <div className={`pt-2.5 text-right text-xs font-semibold tabular-nums ${
                isDark ? "text-white/30" : "text-slate-400"
              }`}>
                {formatHour(hour)}
              </div>

              <div className="space-y-2">
                {items.map((task) => (
                  <motion.button
                    key={task.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/dashboard/calendar/${task.calendarId}`)}
                    className={`w-full text-left rounded-xl px-4 py-3 transition-all ${
                      isDark
                        ? "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07]"
                        : "bg-white hover:bg-slate-50 border border-black/[0.07] shadow-sm"
                    }`}
                  >
                    <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                      {task.title}
                    </div>
                    <div className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
                      {getCalendarName(task.calendarId)} · {task.time}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* UNSCHEDULED TASKS */}
      {unscheduled.length > 0 && (
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
            isDark ? "text-white/30" : "text-slate-400"
          }`}>
            No time set
          </div>
          <div className="space-y-2">
            {unscheduled.map((task) => (
              <motion.button
                key={task.id}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/dashboard/calendar/${task.calendarId}`)}
                className={`w-full text-left rounded-xl px-4 py-3 transition-all ${
                  isDark
                    ? "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07]"
                    : "bg-white hover:bg-slate-50 border border-black/[0.07] shadow-sm"
                }`}
              >
                <div className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                  {task.title}
                </div>
                <div className={`text-xs mt-0.5 ${isDark ? "text-white/40" : "text-slate-500"}`}>
                  {getCalendarName(task.calendarId)}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
