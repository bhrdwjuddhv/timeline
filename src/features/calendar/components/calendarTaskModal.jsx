import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const platforms = [
    {
        value: "instagram",
        label: "Instagram",
        icon: "instagram",
        color: "#E4405F",
    },

    {
        value: "facebook",
        label: "Facebook",
        icon: "facebook",
        color: "#1877F2",
    },

    {
        value: "twitter-x",
        label: "Twitter / X",
        icon: "twitter-x",
        color: "#000000",
    },

    {
        value: "linkedin",
        label: "LinkedIn",
        icon: "linkedin",
        color: "#0A66C2",
    },

    {
        value: "youtube",
        label: "YouTube",
        icon: "youtube",
        color: "#FF0000",
    },

    {
        value: "github",
        label: "GitHub",
        icon: "github",
        color: "#171515",
    },

    {
        value: "discord",
        label: "Discord",
        icon: "discord",
        color: "#5865F2",
    },

    {
        value: "reddit",
        label: "Reddit",
        icon: "reddit",
        color: "#FF4500",
    },

    {
        value: "whatsapp",
        label: "WhatsApp",
        icon: "whatsapp",
        color: "#25D366",
    },

    {
        value: "telegram",
        label: "Telegram",
        icon: "telegram",
        color: "#229ED9",
    },

    {
        value: "snapchat",
        label: "Snapchat",
        icon: "snapchat",
        color: "#FFFC00",
    },

    {
        value: "pinterest",
        label: "Pinterest",
        icon: "pinterest",
        color: "#E60023",
    },

    {
        value: "spotify",
        label: "Spotify",
        icon: "spotify",
        color: "#1DB954",
    },

    {
        value: "twitch",
        label: "Twitch",
        icon: "twitch",
        color: "#9146FF",
    },
];

export default function CalendarTaskModal({
                                              open,
                                              onClose,
                                              onSave,
                                              onDelete,
                                              editingTask,
                                              selectedDate,
                                              fixedCalendar,
                                          }) {

    const [title, setTitle] =
        useState("");

    const [socialMedia, setSocialMedia] =
        useState("instagram");

    const [time, setTime] =
        useState("");

    /*
    =========================
    FORMAT DATE
    =========================
    */

    function formatDate(date) {

        const d = new Date(date);

        const year = d.getFullYear();

        const month = String(
            d.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            d.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    /*
    =========================
    ESC CLOSE
    =========================
    */

    useEffect(() => {

        function handleKeyDown(e) {

            if (e.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

    }, [onClose]);

    /*
    =========================
    POPULATE
    =========================
    */

    useEffect(() => {

        if (editingTask) {

            setTitle(
                editingTask.title || ""
            );

            setSocialMedia(
                editingTask.socialMedia ||
                "instagram"
            );

            setTime(
                editingTask.time || ""
            );

        } else {

            setTitle("");
            setSocialMedia("instagram");
            setTime("");
        }

    }, [editingTask, open]);

    /*
    =========================
    SAVE
    =========================
    */

    function handleSubmit(e) {

        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        /*
        =========================================
        ONLY SEND DATA
        PARENT HANDLES CREATE/UPDATE
        =========================================
        */

        const task = {

            ...(editingTask?.id && {
                id: editingTask.id,
            }),

            title:
                title.trim(),

            socialMedia,

            time,

            date:
                formatDate(
                    editingTask?.date ||
                    selectedDate
                ),

            /*
            =========================================
            RELATION
            =========================================
            */

                calendarId:
                    fixedCalendar?.id ||
                    fixedCalendar,
        };

        onSave(task);
    }

    const currentPlatform =
        platforms.find(
            (p) =>
                p.value === socialMedia
        );

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    onClick={onClose}
                    className="
            fixed inset-0
            z-[999]
            flex items-center justify-center
            bg-black/60
            backdrop-blur-xl
            p-4
          "
                >
                    <motion.div
                        initial={{
                            scale: 0.9,
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            scale: 0.9,
                            opacity: 0,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.25,
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        className="
              relative
              w-full
              max-w-[560px]
              rounded-[36px]
              border border-white/10
              bg-[#0f172a]/95
              overflow-hidden
              shadow-[0_20px_80px_rgba(0,0,0,0.5)]
            "
                    >
                        <div
                            className="
                absolute
                inset-0
                bg-gradient-to-br
                from-fuchsia-500/10
                via-cyan-500/5
                to-transparent
                pointer-events-none
              "
                        />

                        <div className="relative z-10 p-8">

                            <div className="flex items-start justify-between mb-8">

                                <div>

                                    <div className="text-white/50 text-sm mb-2">
                                        {
                                            fixedCalendar?.name ||
                                            fixedCalendar
                                        }
                                    </div>

                                    <h1 className="text-3xl font-black text-white">
                                        {editingTask
                                            ? "Edit Task"
                                            : "Create Task"}
                                    </h1>

                                </div>

                                <button
                                    onClick={onClose}
                                    className="
                    w-12 h-12
                    rounded-2xl
                    bg-white/5
                    hover:bg-white/10
                    text-white
                    transition-all
                  "
                                >
                                    <i className="bi bi-x-lg" />
                                </button>

                            </div>

                            <div
                                className="
                  mb-6
                  rounded-2xl
                  border border-white/10
                  bg-white/5
                  px-5 py-4
                  text-white/70
                "
                            >

                                <div className="text-xs uppercase tracking-widest mb-1 opacity-50">
                                    Selected Date
                                </div>

                                <div className="font-bold text-lg text-white">
                                    {editingTask?.date ||
                                        selectedDate}
                                </div>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-5"
                            >

                                <input
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Task Title"
                                    className="
                    w-full
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                    px-5 py-4
                    text-white
                    outline-none
                    placeholder:text-white/30
                    focus:border-fuchsia-500/50
                  "
                                />

                                <div className="flex flex-col gap-3">

                                    <div className="text-xs uppercase tracking-widest text-white/40 font-bold">
                                        Platform
                                    </div>

                                    <div className="relative">

                                        <select
                                            value={socialMedia}
                                            onChange={(e) =>
                                                setSocialMedia(
                                                    e.target.value
                                                )
                                            }
                                            className="
                        w-full
                        appearance-none
                        rounded-2xl
                        border border-white/10
                        bg-white/5
                        px-5 py-4 pr-14
                        text-white
                        outline-none
                        transition-all
                        focus:border-fuchsia-500/50
                        focus:bg-white/[0.07]
                      "
                                        >
                                            {platforms.map(
                                                (platform) => (
                                                    <option
                                                        key={
                                                            platform.value
                                                        }
                                                        value={
                                                            platform.value
                                                        }
                                                        className="text-black"
                                                    >
                                                        {
                                                            platform.label
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>

                                        <div
                                            className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        pointer-events-none
                      "
                                        >

                                            <div
                                                className="
                          w-8 h-8
                          rounded-lg
                          flex items-center justify-center
                          text-white
                        "
                                                style={{
                                                    backgroundColor:
                                                    currentPlatform?.color,
                                                }}
                                            >
                                                <i
                                                    className={`bi bi-${currentPlatform?.icon}`}
                                                />
                                            </div>

                                        </div>

                                        <style>
                                            {`
                        select {
                          padding-left: 4.5rem;
                        }
                      `}
                                        </style>

                                        <div
                                            className="
                        absolute
                        right-5
                        top-1/2
                        -translate-y-1/2
                        text-white/40
                        pointer-events-none
                      "
                                        >
                                            <i className="bi bi-chevron-down" />
                                        </div>

                                    </div>

                                </div>

                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) =>
                                        setTime(
                                            e.target.value
                                        )
                                    }
                                    className="
                    w-full
                    rounded-2xl
                    bg-white/5
                    border border-white/10
                    px-5 py-4
                    text-white
                    outline-none
                    focus:border-cyan-500/50
                  "
                                />

                                <div className="flex flex-col gap-3 pt-2">

                                    <button
                                        type="submit"
                                        className="
                      h-14
                      rounded-2xl
                      bg-gradient-to-r
                      from-fuchsia-500
                      to-cyan-500
                      font-bold
                      text-white
                      hover:scale-[1.01]
                      transition-all
                    "
                                    >
                                        {editingTask
                                            ? "Update Task"
                                            : "Create Task"}
                                    </button>

                                    {editingTask && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(
                                                    editingTask.id
                                                )
                                            }
                                            className="
                        h-14
                        rounded-2xl
                        bg-red-500/20
                        hover:bg-red-500/30
                        font-bold
                        text-red-300
                        transition-all
                      "
                                        >
                                            Delete Task
                                        </button>
                                    )}

                                </div>

                            </form>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}