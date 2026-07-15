import {
    useState,
    useEffect,
    useMemo,
} from "react";

import { motion } from "motion/react";

import {
    useNavigate,
} from "react-router-dom";

import Calendar from "../shared/components/ui/calendar.jsx";

import FloatingToolbar from "../features/dashboard/components/floatingToolbar.jsx";

import {
    getTasks,
    getCalendars,
} from "../shared/utils/storageUtils.js";

import {
    getValidTasks,
    getCalendarStats,
} from "../shared/utils/calendarUtils.js";

import {
    getCalendarTheme,
    setCalendarTheme,
} from "../shared/utils/themeUtils.js";

import {
    downloadCalendarAsPNG,
    downloadCalendarAsPDF,
} from "../shared/utils/exportUtils.js";

import { useTheme } from "./providers/ThemeContext.jsx";

export default function PersonalCalendarPage() {

    /*
    =========================================
    GLOBAL OVERVIEW ID
    =========================================
    */

    const calendarId =
        "global_overview";

    /*
    =========================================
    NAVIGATION
    =========================================
    */

    const navigate =
        useNavigate();

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
    DATA
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

        setAllTasks(getTasks());

        setCalendars(getCalendars());

    }, []);

    /*
    =========================================
    VALID TASKS
    =========================================
    */

    const validTasks = useMemo(() => {

        return getValidTasks(
            allTasks,
            calendars
        );

    }, [
        allTasks,
        calendars,
    ]);

    /*
    =========================================
    STATS
    =========================================
    */

    const stats = useMemo(() => {

        return getCalendarStats(
            validTasks
        );

    }, [validTasks]);

    /*
    =========================================
    THEME STATE
    =========================================
    */

    const [selectedTheme, setSelectedTheme] =
        useState(() =>
            getCalendarTheme(
                calendarId
            )
        );

    /*
    =========================================
    CHANGE THEME
    =========================================
    */

    const handleThemeChange = (
        themeName
    ) => {

        setCalendarTheme(
            calendarId,
            themeName
        );

        setSelectedTheme(
            getCalendarTheme(
                calendarId
            )
        );
    };

    /*
    =========================================
    EXPORTS
    =========================================
    */

    const handleDownloadPNG = () => {

        downloadCalendarAsPNG(
            "calendar-export-area",
            "Global-Overview"
        );
    };

    const handleDownloadPDF = () => {

        downloadCalendarAsPDF(
            "calendar-export-area",
            "Global-Overview"
        );
    };

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

                    transition={{
                        duration: 0.45,
                    }}

                    className="
            relative
            flex
            flex-col
            items-center
            text-center
            max-w-xl
          "
                >

                    {/* GLOW */}
                    <div
                        className="
              absolute
              -inset-40

              bg-gradient-to-tr
              from-fuchsia-500/20
              to-cyan-500/20

              blur-[120px]

              rounded-full

              -z-10
            "
                    />

                    {/* ICON */}
                    <motion.div

                        animate={{
                            y: [-8, 8, -8],
                        }}

                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}

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
              from-fuchsia-500
              via-pink-500
              to-cyan-400

              text-white

              shadow-2xl
              shadow-fuchsia-500/20
            "
                    >

                        <i className="bi bi-stars"></i>

                    </motion.div>

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
                        Your workspace is empty
                    </h2>

                    {/* TEXT */}
                    <p
                        className={`
              text-lg
              leading-8
              max-w-lg
              mb-10

              ${
                            isDark
                                ? "text-white/55"
                                : "text-slate-600"
                        }
            `}
                    >
                        Create your first cinematic
                        calendar workspace to start
                        organizing campaigns, launches,
                        content systems, and creative
                        planning.
                    </p>

                    {/* BUTTON */}
                    <motion.button

                        whileHover={{
                            scale: 1.05,
                        }}

                        whileTap={{
                            scale: 0.96,
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
        flex
        flex-col

        gap-6

        w-full
        flex-1
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
                        opacity: [0.08, 0.15, 0.08],
                        x: [0, 40, 0],
                        y: [0, -30, 0],
                    }}

                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}

                    className={`
            absolute
            top-[-10%]
            left-[10%]

            w-[700px]
            h-[700px]

            rounded-full
            blur-[140px]

            ${
                        selectedTheme?.accent ||
                        "bg-fuchsia-500"
                    }
          `}
                />

                {/* SECONDARY GLOW */}
                <motion.div

                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.12, 0.05],
                        x: [0, -40, 0],
                        y: [0, 50, 0],
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
            blur-[130px]

            bg-cyan-500/20
          "
                />
            </div>

            {/* ========================================= */}
            {/* TOOLBAR */}
            {/* ========================================= */}

            <FloatingToolbar

                title="Global Overview"

                calendar={{
                    id: calendarId,
                    icon: "bi-grid-1x2-fill",
                    syncStatus: "synced",
                }}

                calendarId={calendarId}

                selectedThemeName={
                    selectedTheme?.name
                }

                onThemeChange={
                    handleThemeChange
                }

                onDownloadPNG={
                    handleDownloadPNG
                }

                onDownloadPDF={
                    handleDownloadPDF
                }

                taskCount={
                    validTasks.length
                }
            />

            {/* ========================================= */}
            {/* STATS */}
            {/* ========================================= */}

            <div
                className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
            >

                {[
                    {
                        label: "Total Tasks",
                        value: stats.total,
                        icon: "bi-grid",
                        glow: "from-fuchsia-500 to-pink-500",
                    },

                    {
                        label: "Completed",
                        value: stats.completed,
                        icon: "bi-check-circle-fill",
                        glow: "from-emerald-500 to-green-400",
                    },

                    {
                        label: "Pending",
                        value: stats.pending,
                        icon: "bi-hourglass-split",
                        glow: "from-amber-400 to-orange-500",
                    },

                    {
                        label: "Workspaces",
                        value: calendars.length,
                        icon: "bi-collection-fill",
                        glow: "from-cyan-400 to-blue-500",
                    },
                ].map((card) => (

                    <motion.div
                        key={card.label}

                        whileHover={{
                            y: -4,
                            scale: 1.01,
                        }}

                        className={`
              relative
              overflow-hidden

              rounded-[28px]
              border

              p-6

              backdrop-blur-2xl

              ${
                            isDark
                                ? "border-white/10 bg-white/[0.03]"
                                : "border-black/5 bg-white/70"
                        }
            `}
                    >

                        {/* GLOW */}
                        <div
                            className={`
                absolute
                inset-0
                opacity-10
                blur-3xl

                bg-gradient-to-br
                ${card.glow}
              `}
                        />

                        <div className="relative">

                            {/* ICON */}
                            <div
                                className={`
                  w-14
                  h-14

                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  text-white
                  text-2xl

                  mb-5

                  bg-gradient-to-br
                  ${card.glow}
                `}
                            >

                                <i className={`bi ${card.icon}`}></i>

                            </div>

                            {/* VALUE */}
                            <div
                                className={`
                  text-4xl
                  font-black
                  tracking-tight

                  ${
                                    isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                }
                `}
                            >
                                {card.value}
                            </div>

                            {/* LABEL */}
                            <div
                                className={`
                  mt-2
                  text-sm

                  ${
                                    isDark
                                        ? "text-white/45"
                                        : "text-slate-500"
                                }
                `}
                            >
                                {card.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ========================================= */}
            {/* CALENDAR */}
            {/* ========================================= */}

            <div
                id="calendar-export-area"
                className="
          w-full
          min-w-0
        "
            >

                <Calendar

                    tasks={validTasks}

                    allTasks={allTasks}

                    setAllTasks={setAllTasks}

                    selectedTheme={
                        selectedTheme
                    }

                    calendarId={calendarId}

                    readOnly={true}
                />
            </div>
        </motion.div>
    );
}