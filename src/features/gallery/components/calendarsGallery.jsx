import {
    useState,
    useMemo,
    useEffect,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import { motion } from "motion/react";

import {
    getCalendars,
    deleteCalendar,
    getTasksByCalendarId,
} from "../../../shared/utils/storageUtils.js";

import { useTheme } from "../../../app/providers/ThemeContext.jsx";

import CreateCalendarModal from "../../calendar/modals/CreateCalendarModal.jsx";

import RenameCalendarModal from "../../calendar/modals/RenameCalendarModal.jsx";

import DeleteConfirmModal from "../../calendar/modals/DeleteConfirmModal.jsx";

export default function CalendarsGallery() {

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

    const [calendars, setCalendars] =
        useState([]);

    const [showCreateModal, setShowCreateModal] =
        useState(false);

    const [showRenameModal, setShowRenameModal] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [selectedCalendar, setSelectedCalendar] =
        useState(null);

    /*
    =========================================
    LOAD
    =========================================
    */

    useEffect(() => {

        refreshCalendars();

    }, []);

    const refreshCalendars = () => {

        setCalendars(
            getCalendars()
        );
    };

    /*
    =========================================
    CREATE
    =========================================
    */

    const handleCalendarCreated = (
        calendar
    ) => {

        /*
        =========================================
        INSTANT UI UPDATE
        =========================================
        */

        setCalendars((prev) => {

            /*
            =========================================
            PREVENT DUPLICATES
            =========================================
            */

            const exists =
                prev.find(
                    (c) =>
                        c.id === calendar.id
                );

            if (exists) {

                return prev;
            }

            return [
                ...prev,
                calendar,
            ];
        });

        /*
        =========================================
        CLOSE MODAL
        =========================================
        */

        setShowCreateModal(false);

        /*
        =========================================
        OPEN WORKSPACE
        =========================================
        */

        navigate(
            `/dashboard/calendar/${calendar.id}`
        );
    };

    /*
    =========================================
    RENAME
    =========================================
    */

    const handleCalendarRenamed = () => {

        refreshCalendars();

        setShowRenameModal(false);

        setSelectedCalendar(null);
    };

    /*
    =========================================
    DELETE
    =========================================
    */

    const handleDeleteClick = (
        e,
        calendar
    ) => {

        e.stopPropagation();

        setSelectedCalendar(
            calendar
        );

        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {

        if (
            !selectedCalendar
        ) {
            return;
        }

        deleteCalendar(
            selectedCalendar.id
        );

        refreshCalendars();

        setShowDeleteModal(false);

        setSelectedCalendar(null);
    };

    /*
    =========================================
    TOTAL TASKS
    =========================================
    */

    const totalTasks =
        useMemo(() => {

            return calendars.reduce(
                (acc, calendar) => {

                    return (
                        acc +
                        getTasksByCalendarId(
                            calendar.id
                        ).length
                    );

                },
                0
            );

        }, [calendars]);

    /*
    =========================================
    EMPTY STATE
    =========================================
    */

    const isEmpty =
        calendars.length === 0;

    /*
    =========================================
    MAIN UI
    =========================================
    */

    return (

        <div
            className="
        relative
        w-full
        pt-6
      "
        >

            {/* ========================================= */}
            {/* AMBIENT BACKGROUND */}
            {/* ========================================= */}

            <div
                className="
          absolute
          inset-0
          top-10
          overflow-hidden
          pointer-events-none
          -z-10
        "
            >

                {/* PRIMARY */}
                <motion.div

                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.08, 0.16, 0.08],
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
            left-[0%]

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
            blur-[140px]

            bg-cyan-500/10
          "
                />
            </div>

            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="mb-14">

                {/* BADGE */}
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

            backdrop-blur-xl

            ${
                        isDark
                            ? "border-white/10 bg-white/5 text-white/60"
                            : "border-black/5 bg-white/60 text-slate-600"
                    }
          `}
                >

                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

                    Creative planning system
                </div>

                {/* TITLE */}
                <h1
                    className={`
            text-5xl
            font-black
            tracking-tight

            ${
                        isDark
                            ? "text-white"
                            : "text-slate-900"
                    }
          `}
                >
                    Creative Workspaces
                </h1>

                {/* TEXT */}
                <p
                    className={`
            mt-4
            text-lg
            leading-8
            max-w-2xl

            ${
                        isDark
                            ? "text-white/60"
                            : "text-slate-600"
                    }
          `}
                >
                    Organize campaigns, launches,
                    content pipelines, and creative
                    workflows inside immersive visual
                    planning systems.
                </p>

                {/* STATS */}
                <div className="flex flex-wrap gap-4 mt-8">

                    {[
                        {
                            label: "Workspaces",
                            value: calendars.length,
                            icon: "bi-collection-fill",
                        },

                        {
                            label: "Tasks",
                            value: totalTasks,
                            icon: "bi-grid-fill",
                        },
                    ].map((item) => (

                        <div
                            key={item.label}

                            className={`
                flex
                items-center
                gap-3

                px-5
                py-4

                rounded-2xl

                border
                backdrop-blur-2xl

                ${
                                isDark
                                    ? "border-white/10 bg-white/[0.03]"
                                    : "border-black/5 bg-white/70"
                            }
              `}
                        >

                            <div
                                className="
                  w-12
                  h-12

                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  text-white
                  text-lg

                  bg-gradient-to-br
                  from-fuchsia-500
                  to-cyan-400
                "
                            >

                                <i className={`bi ${item.icon}`}></i>

                            </div>

                            <div>

                                <div
                                    className={`
                    text-2xl
                    font-black

                    ${
                                        isDark
                                            ? "text-white"
                                            : "text-slate-900"
                                    }
                  `}
                                >
                                    {item.value}
                                </div>

                                <div
                                    className={`
                    text-sm

                    ${
                                        isDark
                                            ? "text-white/45"
                                            : "text-slate-500"
                                    }
                  `}
                                >
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ========================================= */}
            {/* EMPTY STATE */}
            {/* ========================================= */}

            {
                isEmpty ? (

                    <div
                        className="
              flex
              flex-col
              items-center
              justify-center

              py-28
              text-center
            "
                    >

                        <motion.div

                            animate={{
                                y: [-10, 10, -10],
                            }}

                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}

                            className="
                relative

                w-36
                h-36

                flex
                items-center
                justify-center

                mb-10
              "
                        >

                            <div
                                className="
                  absolute
                  inset-0

                  rounded-full

                  blur-3xl
                  opacity-50

                  bg-gradient-to-br
                  from-fuchsia-500
                  to-cyan-400
                "
                            />

                            <div
                                className={`
                  relative
                  z-10

                  w-24
                  h-24

                  rounded-[32px]

                  flex
                  items-center
                  justify-center

                  text-4xl

                  shadow-2xl

                  ${
                                    isDark
                                        ? "bg-white/10 text-white"
                                        : "bg-white text-slate-900"
                                }
                `}
                            >

                                <i className="bi bi-stars"></i>

                            </div>
                        </motion.div>

                        <h2
                            className={`
                text-4xl
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

                        <p
                            className={`
                max-w-lg
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
                            Create your first cinematic
                            planning workspace to organize
                            content systems, launches,
                            strategies, and creative work.
                        </p>

                        <motion.button

                            whileHover={{
                                scale: 1.05,
                            }}

                            whileTap={{
                                scale: 0.96,
                            }}

                            onClick={() =>
                                setShowCreateModal(
                                    true
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
                    </div>

                ) : (

                    <div
                        className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3

              gap-8
            "
                    >

                        <motion.button

                            whileHover={{
                                scale: 1.02,
                                y: -4,
                            }}

                            whileTap={{
                                scale: 0.98,
                            }}

                            onClick={() =>
                                setShowCreateModal(
                                    true
                                )
                            }

                            className={`
                relative

                min-h-[320px]

                rounded-[32px]

                border-2
                border-dashed

                flex
                flex-col
                items-center
                justify-center

                p-10

                transition-all
                duration-300

                ${
                                isDark
                                    ? "border-white/15 bg-white/[0.03] hover:border-cyan-400 hover:bg-white/[0.05]"
                                    : "border-black/10 bg-black/[0.02] hover:border-cyan-500 hover:bg-black/[0.04]"
                            }
              `}
                        >

                            <div
                                className={`
                  w-20
                  h-20

                  rounded-full

                  flex
                  items-center
                  justify-center

                  text-4xl

                  mb-6

                  ${
                                    isDark
                                        ? "bg-white/10 text-white"
                                        : "bg-white text-slate-900 shadow-lg"
                                }
                `}
                            >

                                <i className="bi bi-plus-lg"></i>

                            </div>

                            <div
                                className={`
                  text-2xl
                  font-black
                  tracking-tight

                  ${
                                    isDark
                                        ? "text-white"
                                        : "text-slate-900"
                                }
                `}
                            >
                                Create Workspace
                            </div>

                            <div
                                className={`
                  mt-3
                  text-sm

                  ${
                                    isDark
                                        ? "text-white/45"
                                        : "text-slate-500"
                                }
                `}
                            >
                                Start a new planning system
                            </div>
                        </motion.button>

                        {
                            calendars.map(
                                (calendar) => {

                                    const taskCount =
                                        getTasksByCalendarId(
                                            calendar.id
                                        ).length;

                                    return (

                                        <motion.div

                                            key={calendar.id}

                                            whileHover={{
                                                scale: 1.02,
                                                y: -4,
                                            }}

                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/calendar/${calendar.id}`
                                                )
                                            }

                                            className={`
                        group
                        relative
                        overflow-hidden

                        cursor-pointer

                        rounded-[32px]

                        border

                        backdrop-blur-2xl

                        p-6

                        min-h-[320px]

                        flex
                        flex-col
                        justify-between

                        transition-all
                        duration-300

                        ${
                                                isDark
                                                    ? "border-white/10 bg-white/[0.03]"
                                                    : "border-black/5 bg-white/80"
                                            }
                      `}
                                        >

                                            <div
                                                className="
                          absolute
                          -inset-20

                          opacity-0
                          group-hover:opacity-100

                          blur-[80px]

                          transition-opacity
                          duration-700

                          bg-gradient-to-br
                          from-fuchsia-500/20
                          to-cyan-400/20
                        "
                                            />

                                            <div className="relative">

                                                <div className="flex items-start justify-between mb-6">

                                                    <div
                                                        className="
                              w-16
                              h-16

                              rounded-3xl

                              flex
                              items-center
                              justify-center

                              text-white
                              text-2xl

                              shadow-xl

                              bg-gradient-to-br
                              from-fuchsia-500
                              via-pink-500
                              to-cyan-400
                            "
                                                    >

                                                        <i className="bi bi-calendar3"></i>

                                                    </div>

                                                    <div
                                                        className="
                              flex
                              gap-2

                              opacity-0
                              group-hover:opacity-100

                              transition-opacity
                            "
                                                    >

                                                        <button

                                                            onClick={(e) => {

                                                                e.stopPropagation();

                                                                setSelectedCalendar(
                                                                    calendar
                                                                );

                                                                setShowRenameModal(
                                                                    true
                                                                );
                                                            }}

                                                            className={`
                                w-10
                                h-10

                                rounded-xl

                                flex
                                items-center
                                justify-center

                                transition-all

                                ${
                                                                isDark
                                                                    ? "bg-white/10 hover:bg-white/20 text-white"
                                                                    : "bg-black/5 hover:bg-black/10 text-slate-700"
                                                            }
                              `}
                                                        >

                                                            <i className="bi bi-pencil-fill text-sm"></i>

                                                        </button>

                                                        <button

                                                            onClick={(e) =>
                                                                handleDeleteClick(
                                                                    e,
                                                                    calendar
                                                                )
                                                            }

                                                            className={`
                                w-10
                                h-10

                                rounded-xl

                                flex
                                items-center
                                justify-center

                                transition-all

                                ${
                                                                isDark
                                                                    ? "bg-red-500/20 hover:bg-red-500/40 text-red-400"
                                                                    : "bg-red-50 hover:bg-red-100 text-red-500"
                                                            }
                              `}
                                                        >

                                                            <i className="bi bi-trash-fill text-sm"></i>

                                                        </button>
                                                    </div>
                                                </div>

                                                <h3
                                                    className={`
                            text-2xl
                            font-black
                            tracking-tight

                            ${
                                                        isDark
                                                            ? "text-white"
                                                            : "text-slate-900"
                                                    }
                          `}
                                                >
                                                    {calendar.name}
                                                </h3>

                                                <p
                                                    className={`
                            mt-4
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
                                                        calendar.description ||
                                                        "Creative workspace for content systems and planning."
                                                    }
                                                </p>
                                            </div>

                                            <div className="relative mt-8">

                                                <div className="flex items-center justify-between">

                                                    <div
                                                        className={`
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

                                                        <i className="bi bi-grid-fill"></i>

                                                        {taskCount} tasks
                                                    </div>

                                                    <div
                                                        className={`
                              text-xs

                              ${
                                                            isDark
                                                                ? "text-white/35"
                                                                : "text-slate-400"
                                                        }
                            `}
                                                    >

                                                        Updated{" "}

                                                        {
                                                            new Date(
                                                                calendar.updatedAt
                                                            ).toLocaleDateString()
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                }
                            )
                        }
                    </div>
                )
            }

            <CreateCalendarModal

                isOpen={
                    showCreateModal
                }

                onClose={() =>
                    setShowCreateModal(
                        false
                    )
                }

                onCalendarCreated={
                    handleCalendarCreated
                }
            />

            <RenameCalendarModal

                isOpen={
                    showRenameModal
                }

                calendar={
                    selectedCalendar
                }

                onClose={() => {

                    setShowRenameModal(
                        false
                    );

                    setSelectedCalendar(
                        null
                    );
                }}

                onCalendarRenamed={
                    handleCalendarRenamed
                }
            />

            <DeleteConfirmModal

                isOpen={
                    showDeleteModal
                }

                calendarName={
                    selectedCalendar?.name
                }

                onConfirm={
                    handleDeleteConfirm
                }

                onClose={() => {

                    setShowDeleteModal(
                        false
                    );

                    setSelectedCalendar(
                        null
                    );
                }}
            />
        </div>
    );
}