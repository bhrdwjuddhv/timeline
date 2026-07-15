import {
  useState,
  useEffect,
  useMemo,
} from "react";

import { motion } from "motion/react";

import {
  useNavigate,
} from "react-router-dom";

import { useTheme } from "./providers/ThemeContext.jsx";

import {
  getTasks,
  getCalendars,
  getCalendarById,
} from "../shared/utils/storageUtils.js";

import {
  getValidTasks,
  sortTasks,
  taskCoversDate,
} from "../shared/utils/calendarUtils.js";

export default function DailyCalendarPage() {

  /*
  =========================================
  THEME
  =========================================
  */

  const { theme } =
      useTheme();

  const isDark =
      theme === "dark";

  /*
  =========================================
  NAVIGATION
  =========================================
  */

  const navigate =
      useNavigate();

  /*
  =========================================
  STATE
  =========================================
  */

  const [allTasks, setAllTasks] =
      useState([]);

  const [calendars, setCalendars] =
      useState([]);

  /*
  =========================================
  LOAD DATA
  =========================================
  */

  useEffect(() => {

    setAllTasks(
        getTasks()
    );

    setCalendars(
        getCalendars()
    );

  }, []);

  /*
  =========================================
  TODAY
  =========================================
  */

  const todayStr =
      new Date()
          .toLocaleDateString("en-CA");

  /*
  =========================================
  TODAY TASKS
  =========================================
  */

  const todayTasks = useMemo(() => {

    const validTasks =
        getValidTasks(
            allTasks,
            calendars
        );

    return sortTasks(
        validTasks.filter(
            (task) =>
                taskCoversDate(task, todayStr)
        )
    );

  }, [
    allTasks,
    calendars,
    todayStr,
  ]);

  /*
  =========================================
  NAVIGATION
  =========================================
  */

  const handleTaskClick = (
      task
  ) => {

    if (
        task.calendarId
    ) {

      navigate(
          `/dashboard/calendar/${task.calendarId}`
      );
    }
  };

  /*
  =========================================
  HOURS
  =========================================
  */

  const hours =
      Array.from(
          { length: 24 },
          (_, i) => i
      );

  /*
  =========================================
  EMPTY STATE
  =========================================
  */

  if (
      calendars.length === 0
  ) {

    return (

        <div
            className="
          flex-1
          w-full

          flex
          flex-col

          items-center
          justify-center

          min-h-[80vh]
        "
        >

          <motion.div

              initial={{
                opacity: 0,
                scale: 0.92,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              className="
            relative
            flex
            flex-col
            items-center
            text-center

            max-w-lg
          "
          >

            {/* GLOW */}
            <div
                className="
              absolute
              -inset-40

              bg-gradient-to-tr
              from-cyan-500/20
              to-fuchsia-500/20

              blur-[120px]

              rounded-full

              -z-10
            "
            />

            {/* ICON */}
            <div
                className="
              w-28
              h-28

              rounded-[36px]

              flex
              items-center
              justify-center

              text-5xl

              mb-10

              bg-gradient-to-br
              from-cyan-500
              via-blue-500
              to-fuchsia-500

              text-white

              shadow-2xl
              shadow-cyan-500/20
            "
            >

              <i className="bi bi-clock-history"></i>

            </div>

            {/* TITLE */}
            <h2
                className={`
              text-5xl
              font-black
              tracking-tight
              mb-5

              ${
                    isDark
                        ? "text-white"
                        : "text-slate-900"
                }
            `}
            >
              Daily Planner
            </h2>

            {/* TEXT */}
            <p
                className={`
              text-lg
              leading-8
              mb-10

              ${
                    isDark
                        ? "text-white/55"
                        : "text-slate-600"
                }
            `}
            >
              Create your first workspace to
              start seeing a cinematic daily
              timeline of your creative tasks.
            </p>

            {/* BUTTON */}
            <motion.button

                whileHover={{
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}

                onClick={() =>
                    navigate(
                        "/dashboard/gallery"
                    )
                }

                className="
              px-8
              py-4

              rounded-2xl

              font-bold
              text-lg

              bg-gradient-to-r
              from-fuchsia-500
              via-pink-500
              to-cyan-400

              text-white

              shadow-2xl
              shadow-fuchsia-500/20
            "
            >

              <i className="bi bi-plus-lg mr-2"></i>

              Create Workspace
            </motion.button>
          </motion.div>
        </div>
    );
  }

  /*
  =========================================
  MAIN UI
  =========================================
  */

  return (

      <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.45,
          }}

          className="
        relative
        flex-1
        w-full
      "
      >

        {/* ========================================= */}
        {/* AMBIENT BACKGROUND */}
        {/* ========================================= */}

        <div
            className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
          -z-10
        "
        >

          {/* PRIMARY GLOW */}
          <motion.div

              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.08, 0.14, 0.08],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}

              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="
            absolute
            top-[-10%]
            left-[5%]

            w-[700px]
            h-[700px]

            rounded-full
            blur-[140px]

            bg-fuchsia-500/10
          "
          />

          {/* SECONDARY */}
          <motion.div

              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.05, 0.12, 0.05],
                x: [0, -50, 0],
                y: [0, 40, 0],
              }}

              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="
            absolute
            bottom-[-10%]
            right-[0%]

            w-[600px]
            h-[600px]

            rounded-full
            blur-[140px]

            bg-cyan-500/10
          "
          />
        </div>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-12">

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

            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

            Live daily timeline
          </div>

          <h1
              className={`
            text-5xl
            font-black
            tracking-tight
            mb-4

            ${
                  isDark
                      ? "text-white"
                      : "text-slate-900"
              }
          `}
          >
            Today's Schedule
          </h1>

          <p
              className={`
            text-lg

            ${
                  isDark
                      ? "text-white/60"
                      : "text-slate-600"
              }
          `}
          >
            {
              new Date().toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
              )
            }
          </p>
        </div>

        {/* ========================================= */}
        {/* MAIN LAYOUT */}
        {/* ========================================= */}

        <div
            className="
          flex
          flex-col
          xl:flex-row

          gap-8
        "
        >

          {/* ========================================= */}
          {/* TIMELINE */}
          {/* ========================================= */}

          <div
              className={`
            flex-1

            rounded-[36px]

            border

            p-6
            md:p-8

            backdrop-blur-3xl
            shadow-2xl

            ${
                  isDark
                      ? "bg-white/[0.03] border-white/10"
                      : "bg-white/80 border-black/5"
              }
          `}
          >

            <div className="space-y-8">

              {
                hours.map((hour) => {

                  const formattedHour =
                      `${hour}`
                          .padStart(2, "0") +
                      ":00";

                  const tasksInHour =
                      todayTasks.filter(
                          (task) => {

                            if (!task.time) {
                              return false;
                            }

                            const taskHour =
                                parseInt(
                                    task.time.split(":")[0]
                                );

                            return (
                                taskHour ===
                                hour
                            );
                          }
                      );

                  return (

                      <div
                          key={hour}
                          className="
                      relative
                      flex
                      gap-6
                    "
                      >

                        {/* TIME */}
                        <div
                            className={`
                        w-16
                        shrink-0

                        text-right
                        text-sm
                        font-bold

                        ${
                                isDark
                                    ? "text-white/40"
                                    : "text-slate-400"
                            }
                      `}
                        >
                          {formattedHour}
                        </div>

                        {/* TRACK */}
                        <div
                            className={`
                        absolute
                        left-20
                        top-3
                        bottom-0
                        w-px

                        ${
                                isDark
                                    ? "bg-white/10"
                                    : "bg-black/5"
                            }
                      `}
                        />

                        {/* CONTENT */}
                        <div
                            className="
                        flex-1
                        space-y-4
                        relative
                      "
                        >

                          {/* DOT */}
                          <div
                              className={`
                          absolute
                          -left-[27px]
                          top-1.5

                          w-3
                          h-3

                          rounded-full
                          border-2

                          ${
                                  isDark
                                      ? "border-slate-900 bg-white/20"
                                      : "border-white bg-slate-300"
                              }
                        `}
                          />

                          {
                            tasksInHour.length ===
                            0 ? (

                                <div
                                    className={`
                              h-10
                              border-b
                              border-dashed

                              ${
                                        isDark
                                            ? "border-white/5"
                                            : "border-black/5"
                                    }
                            `}
                                />

                            ) : (

                                tasksInHour.map(
                                    (task) => {

                                      const calendar =
                                          getCalendarById(
                                              task.calendarId
                                          );

                                      return (

                                          <motion.div

                                              key={task.id}

                                              initial={{
                                                opacity: 0,
                                                x: -10,
                                              }}

                                              animate={{
                                                opacity: 1,
                                                x: 0,
                                              }}

                                              whileHover={{
                                                y: -3,
                                              }}

                                              onClick={() =>
                                                  handleTaskClick(
                                                      task
                                                  )
                                              }

                                              className={`
                                    relative
                                    overflow-hidden

                                    p-5

                                    rounded-[28px]

                                    cursor-pointer

                                    border

                                    shadow-lg

                                    transition-all
                                    duration-300

                                    ${
                                                  isDark
                                                      ? "bg-white/[0.04] border-white/10 hover:border-fuchsia-500/40"
                                                      : "bg-white border-black/5 hover:border-fuchsia-400"
                                              }
                                  `}
                                          >

                                            {/* GLOW */}
                                            <div
                                                className="absolute inset-0 opacity-10 blur-3xl"
                                                style={{
                                                  background:
                                                      `linear-gradient(135deg, ${
                                                          calendar?.color ||
                                                          "#d946ef"
                                                      }, #22d3ee)`,
                                                }}
                                            />

                                            <div className="relative">

                                              {/* TOP */}
                                              <div className="flex items-start justify-between gap-4">

                                                <div>

                                                  <h3
                                                      className={`
                                            text-lg
                                            font-bold

                                            ${
                                                          isDark
                                                              ? "text-white"
                                                              : "text-slate-900"
                                                      }
                                          `}
                                                  >
                                                    {task.title}
                                                  </h3>

                                                  <div
                                                      className={`
                                            mt-2
                                            flex
                                            items-center
                                            gap-2

                                            text-sm

                                            ${
                                                          isDark
                                                              ? "text-white/45"
                                                              : "text-slate-500"
                                                      }
                                          `}
                                                  >

                                                    <i className="bi bi-clock"></i>

                                                    {
                                                      task.time
                                                    }
                                                  </div>
                                                </div>

                                                {/* BADGE */}
                                                <div
                                                    className="
                                          px-3
                                          py-1.5

                                          rounded-full

                                          text-xs
                                          font-bold
                                          uppercase
                                          tracking-wider

                                          text-white
                                        "
                                                    style={{
                                                      background:
                                                          calendar?.color ||
                                                          "#d946ef",
                                                    }}
                                                >
                                                  {
                                                      calendar?.name ||
                                                      "Workspace"
                                                  }
                                                </div>
                                              </div>

                                              {/* DESCRIPTION */}
                                              {
                                                  task.description && (

                                                      <p
                                                          className={`
                                            mt-4
                                            text-sm
                                            leading-7

                                            ${
                                                              isDark
                                                                  ? "text-white/60"
                                                                  : "text-slate-600"
                                                          }
                                          `}
                                                      >
                                                        {
                                                          task.description
                                                        }
                                                      </p>
                                                  )
                                              }
                                            </div>
                                          </motion.div>
                                      );
                                    }
                                )
                            )
                          }
                        </div>
                      </div>
                  );
                })
              }
            </div>
          </div>

          {/* ========================================= */}
          {/* FLEXIBLE TASKS */}
          {/* ========================================= */}

          <div
              className="
            w-full
            xl:w-[380px]
            shrink-0
          "
          >

            <div
                className={`
              text-xl
              font-black
              tracking-tight
              mb-5

              ${
                    isDark
                        ? "text-white"
                        : "text-slate-900"
                }
            `}
            >
              Flexible Tasks
            </div>

            <div className="space-y-4">

              {
                todayTasks.filter(
                    (task) => !task.time
                ).length === 0 ? (

                    <div
                        className={`
                    rounded-[28px]

                    p-10

                    border
                    border-dashed

                    text-center

                    ${
                            isDark
                                ? "border-white/10 text-white/40"
                                : "border-black/10 text-slate-400"
                        }
                  `}
                    >

                      <i className="bi bi-stars text-4xl"></i>

                      <div className="mt-4">
                        No flexible tasks today
                      </div>
                    </div>

                ) : (

                    todayTasks
                        .filter(
                            (task) =>
                                !task.time
                        )
                        .map((task) => {

                          const calendar =
                              getCalendarById(
                                  task.calendarId
                              );

                          return (

                              <motion.div

                                  key={task.id}

                                  initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                  }}

                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                  }}

                                  whileHover={{
                                    y: -3,
                                  }}

                                  onClick={() =>
                                      handleTaskClick(
                                          task
                                      )
                                  }

                                  className="
                          cursor-pointer
                        "
                              >

                                <div
                                    className={`
                            relative
                            overflow-hidden

                            rounded-[28px]

                            p-5

                            border

                            shadow-lg

                            transition-all
                            duration-300

                            ${
                                        isDark
                                            ? "bg-white/[0.04] border-white/10 hover:border-fuchsia-500/40"
                                            : "bg-white border-black/5 hover:border-fuchsia-400"
                                    }
                          `}
                                >

                                  {/* GLOW */}
                                  <div
                                      className="absolute inset-0 opacity-10 blur-3xl"
                                      style={{
                                        background:
                                            `linear-gradient(135deg, ${
                                                calendar?.color ||
                                                "#d946ef"
                                            }, #22d3ee)`,
                                      }}
                                  />

                                  <div className="relative">

                                    {/* TOP */}
                                    <div className="flex items-center justify-between mb-4">

                                      <div
                                          className="
                                  px-3
                                  py-1.5

                                  rounded-full

                                  text-xs
                                  font-bold
                                  uppercase
                                  tracking-wider

                                  text-white
                                "
                                          style={{
                                            background:
                                                calendar?.color ||
                                                "#d946ef",
                                          }}
                                      >
                                        {
                                            calendar?.name ||
                                            "Workspace"
                                        }
                                      </div>

                                      <div
                                          className={`
                                  w-10
                                  h-10

                                  rounded-2xl

                                  flex
                                  items-center
                                  justify-center

                                  ${
                                              isDark
                                                  ? "bg-white/10 text-white"
                                                  : "bg-slate-100 text-slate-600"
                                          }
                                `}
                                      >

                                        <i
                                            className={`
                                    bi
                                    ${
                                                task.socialMedia
                                                    ? `bi-${task.socialMedia}`
                                                    : "bi-stars"
                                            }
                                  `}
                                        />

                                      </div>
                                    </div>

                                    {/* TITLE */}
                                    <h3
                                        className={`
                                text-xl
                                font-bold

                                ${
                                            isDark
                                                ? "text-white"
                                                : "text-slate-900"
                                        }
                              `}
                                    >
                                      {task.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    {
                                        task.description && (

                                            <p
                                                className={`
                                    mt-3
                                    text-sm
                                    leading-7

                                    ${
                                                    isDark
                                                        ? "text-white/55"
                                                        : "text-slate-600"
                                                }
                                  `}
                                            >
                                              {
                                                task.description
                                              }
                                            </p>
                                        )
                                    }
                                  </div>
                                </div>
                              </motion.div>
                          );
                        })
                )
              }
            </div>
          </div>
        </div>
      </motion.div>
  );
}