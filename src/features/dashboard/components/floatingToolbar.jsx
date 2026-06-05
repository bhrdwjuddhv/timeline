import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { themes } from "@/shared/utils/themeUtils.js";

export default function FloatingToolbar({
                                            title,
                                            calendar,
                                            calendarId,
                                            selectedThemeName,
                                            onThemeChange,
                                            onDownloadPNG,
                                            onDownloadPDF,
                                            onSave,
                                            onShare,
                                            saveState = "idle",
                                            taskCount = 0,
                                        }) {
    const [themeDropdownOpen, setThemeDropdownOpen] =
        useState(false);

    const [exportDropdownOpen, setExportDropdownOpen] =
        useState(false);

    const [shareDropdownOpen, setShareDropdownOpen] =
        useState(false);


    const [copied, setCopied] =
        useState(false);



    /*
    =========================================
    SHARE LINK
    =========================================
    */

    const shareLink =
        `${window.location.origin}/shared/calendar/${calendar.id}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(
                shareLink
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error(
                "Failed to copy link:",
                error
            );
        }
    };

    /*
    =========================================
    FILTER THEMES
    =========================================
    */

    const filteredThemes =
        themes.filter((themeItem) =>
            themeItem.name
                .toLowerCase()

        );

    return (
        <motion.div
            initial={{
                y: -20,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            className="
        sticky
        top-6
        z-30
        mb-8

        rounded-[32px]

        border
        border-white/10

        bg-[#060816]/72

        supports-[backdrop-filter]:bg-[#060816]/55

        shadow-2xl
        backdrop-blur-xl

        px-5
        py-4

        flex
        items-center
        justify-between

        transition-all
        duration-300
      "
        >
            {/* ========================================= */}
            {/* LEFT */}
            {/* ========================================= */}

            <div className="flex items-center gap-5 min-w-0">
                {/* ICON */}
                <div
                    className="
            w-14
            h-14
            rounded-3xl
            bg-gradient-to-br
            from-fuchsia-500
            via-pink-500
            to-cyan-400
            flex
            items-center
            justify-center
            text-white
            shadow-2xl
            shadow-fuchsia-500/20
            shrink-0
          "
                >
                    <i
                        className={`
              bi
              ${
                            calendar?.icon ||
                            "bi-calendar3"
                        }
              text-2xl
            `}
                    ></i>
                </div>

                {/* TITLE */}
                <div className="min-w-0">
                    <div
                        className="
              text-3xl
              font-black
              tracking-tight
              truncate
              text-white
            "
                    >
                        {
                            title ||
                            calendar?.name ||
                            "Untitled Calendar"
                        }
                    </div>

                    <div
                        className="
              mt-1
              flex
              items-center
              gap-3
              text-sm
              text-white/45
            "
                    >
            <span>
              {taskCount} tasks
            </span>

                        <span>•</span>

                        <div className="flex items-center gap-2">

                            {/* SAVING / SYNCING */}
                            {saveState === "saving" && (
                                <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                    <span className="text-amber-300">Syncing...</span>
                                </>
                            )}

                            {/* SAVED / SYNCED */}
                            {saveState === "saved" && (
                                <>
                                    <i className="bi bi-check-circle-fill text-emerald-400"></i>
                                    <span className="text-emerald-300">Synced</span>
                                </>
                            )}

                            {/* PENDING CHANGES */}
                            {saveState === "pending" && (
                                <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                                    <span className="text-orange-300">Pending Changes</span>
                                </>
                            )}

                            {/* IDLE */}
                            {saveState === "idle" && (
                                <>
                                    <i className="bi bi-cloud-check-fill text-cyan-400"></i>
                                    <span>Synced</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* RIGHT ACTIONS */}
            {/* ========================================= */}

            <div
                className="
          flex
          items-center
          gap-3
          relative
          pl-6
        "
            >
                <button
                    onClick={onSave}
                    className="
        flex
        items-center
        gap-2
        px-5
        py-3
        rounded-2xl
        text-sm
        font-semibold
        bg-gradient-to-r
        from-emerald-500
        to-cyan-400
        text-white
        shadow-xl
        shadow-emerald-500/20
        hover:scale-[1.03]
        transition-all
        duration-300
        hover:cursor-pointer
    "
                >

                    {saveState === "saving" ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Syncing
                        </>
                    ) : saveState === "saved" ? (
                        <>
                            <i className="bi bi-check-lg"></i>
                            Saved
                        </>
                    ) : saveState === "pending" ? (
                        <>
                            <i className="bi bi-cloud-upload-fill"></i>
                            Save Now
                        </>
                    ) : (
                        <>
                            <i className="bi bi-cloud-upload-fill"></i>
                            Save
                        </>
                    )}
                </button>
                {/* ========================================= */}
                {/* SHARE — hidden for non-shareable views */}
                {/* ========================================= */}

                {onShare && (
                <div className="relative">
                    <button
                        onClick={async () => {

                            try {

                                if (onShare) {

                                    await onShare();
                                }

                                setShareDropdownOpen(
                                    !shareDropdownOpen
                                );

                                setThemeDropdownOpen(
                                    false
                                );

                                setExportDropdownOpen(
                                    false
                                );

                            } catch (error) {

                                console.error(
                                    "Share failed:",
                                    error
                                );
                            }
                        }}
                        className="
              flex
              items-center
              gap-2
              px-4
              py-3
              rounded-2xl
              text-sm
              font-semibold
              border
              border-white/10
              bg-white/10
              text-white
              hover:bg-white/15
              hover:cursor-pointer
              transition-all
              duration-300
            "
                    >
                        <i className="bi bi-share-fill"></i>

                        Share

                        <i
                            className={`
                bi
                bi-chevron-down
                text-xs
                transition-transform
                ${
                                shareDropdownOpen
                                    ? "rotate-180"
                                    : ""
                            }
              `}
                        ></i>
                    </button>

                    <AnimatePresence>
                        {shareDropdownOpen && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}
                                className="
                  absolute
                  right-0
                  top-full
                  mt-3

                  w-[360px]

                  rounded-[28px]

                  border
                  border-white/10

                  bg-[#0b1020]/95

                  shadow-2xl
                  backdrop-blur-xl

                  overflow-hidden
                "
                            >
                                <div className="p-5 border-b border-white/10">
                                    <div className="text-lg font-bold text-white">
                                        Share Calendar
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-white/50">
                                        Anyone with this link can
                                        view this calendar in
                                        read-only mode.
                                    </p>
                                </div>

                                <div className="p-5">
                                    <div
                                        className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-black/20

                      flex
                      items-center
                      overflow-hidden
                    "
                                    >
                                        <input
                                            value={shareLink}
                                            readOnly
                                            className="
                        flex-1
                        px-4
                        py-4
                        bg-transparent
                        outline-none
                        text-sm
                        text-white
                      "
                                        />

                                        <button
                                            onClick={
                                                handleCopyLink
                                            }
                                            className="
                                                px-5
                                                py-4
                                                bg-gradient-to-r
                                                from-fuchsia-500
                                                to-cyan-400
                                                text-white
                                                font-semibold
                                                text-sm
                                                hover:cursor-pointer
                                                hover:opacity-90
                                                transition-all "
                                                    >
                                            {copied
                                                ? "Copied!"
                                                : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                )}

                {/* ========================================= */}
                {/* THEME */}
                {/* ========================================= */}

                {onThemeChange && (
                    <div className="relative">
                        <button
                            onClick={() => {
                                setThemeDropdownOpen(
                                    !themeDropdownOpen
                                );

                                setExportDropdownOpen(
                                    false
                                );

                                setShareDropdownOpen(
                                    false
                                );
                            }}
                            className="
                flex
                items-center
                gap-3
                hover:cursor-pointer
                px-4
                py-3
                rounded-2xl
                text-sm
                font-semibold
                border
                border-white/10
                bg-white/10
                text-white
                hover:bg-white/15
                transition-all
              "
                        >
                            <AnimatePresence>
                                {themeDropdownOpen && (
                                    <motion.div

                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}

                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                        }}

                                        exit={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.95,
                                        }}

                                        transition={{
                                            duration: 0.18,
                                        }}

                                        className="
                absolute
                right-0
                top-full
                mt-3

                w-[340px]

                rounded-[28px]

                border
                border-white/10

                bg-[#0b1020]/95

                shadow-2xl
                backdrop-blur-xl

                overflow-hidden

                z-[999]
            "
                                    >

                                        {/* HEADER */}
                                        <div className="p-5 border-b border-white/10">

                                            <div className="text-lg font-bold text-white">
                                                Choose Theme
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-white/50">
                                                Personalize your workspace appearance.
                                            </p>

                                        </div>



                                        {/* THEMES */}
                                        <div
                                            className="
                    max-h-[420px]
                    overflow-y-auto
                    p-3
                "
                                        >

                                            <div className="grid grid-cols-1 gap-2">

                                                {filteredThemes.map(
                                                    (themeItem) => {

                                                        const isSelected =
                                                            themeItem.name ===
                                                            selectedThemeName;

                                                        return (

                                                            <button
                                                                key={themeItem.name}

                                                                onClick={() => {

                                                                    onThemeChange(
                                                                        themeItem.name
                                                                    );

                                                                    setThemeDropdownOpen(
                                                                        false
                                                                    );
                                                                }}

                                                                className={`
                                        group
                                        flex
                                        items-center
                                        justify-between
                                        w-full
                                        rounded-2xl
                                        hover:cursor-pointer
                                        px-4
                                        py-4
                                        border
                                        transition-all
                                        duration-300

                                        ${
                                                                    isSelected
                                                                        ? `
                                                    border-fuchsia-500/40
                                                    bg-fuchsia-500/10
                                                `
                                                                        : `
                                                    border-white/5
                                                    bg-white/[0.03]
                                                    hover:bg-white/[0.06]
                                                `
                                                                }
                                    `}
                                                            >

                                                                <div className="flex items-center gap-4">

                                                                    {/* PREVIEW */}
                                                                    <div className="flex -space-x-2">

                                                                        <div
                                                                            className={`
                                                    w-5
                                                    h-5
                                                    rounded-full

                                                    ${themeItem.background}
                                                `}
                                                                        />

                                                                        <div
                                                                            className={`
                                                    w-5
                                                    h-5
                                                    rounded-full

                                                    ${themeItem.primary}
                                                `}
                                                                        />

                                                                        <div
                                                                            className={`
                                                    w-5
                                                    h-5
                                                    rounded-full

                                                    ${themeItem.secondary}
                                                `}
                                                                        />

                                                                    </div>

                                                                    {/* NAME */}
                                                                    <div
                                                                        className="
                                                text-left
                                            "
                                                                    >

                                                                        <div
                                                                            className="
                                                    text-sm
                                                    font-semibold
                                                    text-white
                                                "
                                                                        >
                                                                            {themeItem.name}
                                                                        </div>

                                                                    </div>
                                                                </div>

                                                                {/* CHECK */}
                                                                {isSelected && (
                                                                    <i
                                                                        className="
                                                bi
                                                bi-check-circle-fill

                                                text-fuchsia-400
                                                text-lg
                                            "
                                                                    />
                                                                )}
                                                            </button>
                                                        );
                                                    }
                                                )}

                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="flex -space-x-1">
                                <div
                                    className={`
                    w-4
                    h-4
                    rounded-full
                    ${
                                        themes.find(
                                            (
                                                themeItem
                                            ) =>
                                                themeItem.name ===
                                                selectedThemeName
                                        )?.background ||
                                        "bg-zinc-500"
                                    }
                  `}
                                />
                            </div>

                            {selectedThemeName}

                            <i
                                className={`
                  bi
                  bi-chevron-down
                  text-xs
                  transition-transform
                  ${
                                    themeDropdownOpen
                                        ? "rotate-180"
                                        : ""
                                }
                `}
                            ></i>
                        </button>
                    </div>
                )}

                {/* ========================================= */}
                {/* EXPORT */}
                {/* ========================================= */}

                <div className="relative">
                    <button
                        onClick={() => {
                            setExportDropdownOpen(
                                !exportDropdownOpen
                            );

                            setThemeDropdownOpen(
                                false
                            );

                            setShareDropdownOpen(
                                false
                            );
                        }}
                        className="
              flex
              items-center
              gap-2
              hover:cursor-pointer
              px-4
              py-3
              rounded-2xl
              text-sm
              font-semibold
              border
              border-white/10
              bg-white/10
              text-white
              hover:bg-white/15
              transition-all
            "
                    >
                        <i className="bi bi-cloud-arrow-down"></i>

                        Export

                        <i
                            className={`
                bi
                bi-chevron-down
                text-xs
                transition-transform
                ${
                                exportDropdownOpen
                                    ? "rotate-180"
                                    : ""
                            }
              `}
                        ></i>
                    </button>
                    <AnimatePresence>
                        {exportDropdownOpen && (
                            <motion.div

                                initial={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}

                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}

                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}

                                transition={{
                                    duration: 0.18,
                                }}

                                className="
                absolute
                right-0
                top-full
                mt-3

                w-[320px]

                rounded-[28px]

                border
                border-white/10

                bg-[#0b1020]/95

                shadow-2xl
                backdrop-blur-xl

                overflow-hidden

                z-[999]
            "
                            >

                                {/* HEADER */}
                                <div className="p-5 border-b border-white/10">

                                    <div className="text-lg font-bold text-white">
                                        Export Calendar
                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-white/50">
                                        Download your workspace in high-quality formats.
                                    </p>

                                </div>

                                {/* OPTIONS */}
                                <div className="p-3 flex flex-col gap-2">

                                    {/* PNG */}
                                    <button
                                        onClick={() => {

                                            onDownloadPNG?.();

                                            setExportDropdownOpen(
                                                false
                                            );
                                        }}

                                        className="
                        group

                        flex
                        items-center
                        justify-between
                        w-full
                        rounded-2xl
                        border
                        border-white/5
                        bg-white/[0.03]
                        hover:bg-white/[0.06]
                        px-4
                        py-4
                        hover:cursor-pointer
                        transition-all
                        duration-300
                    "
                                    >

                                        <div className="flex items-center gap-4">

                                            <div
                                                className="
                                w-12
                                h-12

                                rounded-2xl

                                bg-gradient-to-br
                                from-fuchsia-500
                                to-pink-500

                                flex
                                items-center
                                justify-center

                                text-white
                                text-lg
                            "
                                            >

                                                <i className="bi bi-image-fill"></i>

                                            </div>

                                            <div className="text-left">

                                                <div
                                                    className="
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                                                >
                                                    Export PNG
                                                </div>

                                                <div
                                                    className="
                                    mt-1
                                    text-xs
                                    text-white/40
                                "
                                                >
                                                    High-resolution image export
                                                </div>

                                            </div>
                                        </div>

                                        <i
                                            className="
                            bi
                            bi-arrow-right

                            text-white/30

                            group-hover:text-white
                            group-hover:translate-x-1

                            transition-all
                        "
                                        />

                                    </button>

                                    {/* PDF */}
                                    <button
                                        onClick={() => {

                                            onDownloadPDF?.();

                                            setExportDropdownOpen(
                                                false
                                            );
                                        }}

                                        className="
                                            group
                                            flex
                                            items-center
                                            justify-between
                                            hover:cursor-pointer
                                            w-full
                                            rounded-2xl
                                            border
                                            border-white/5
                                            bg-white/[0.03]
                                            hover:bg-white/[0.06]
                                            px-4
                                            py-4
                                            transition-all
                                            duration-300
                                        "
                                    >

                                        <div className="flex items-center gap-4">

                                            <div
                                                className="
                                w-12
                                h-12

                                rounded-2xl

                                bg-gradient-to-br
                                from-cyan-500
                                to-blue-500

                                flex
                                items-center
                                justify-center

                                text-white
                                text-lg
                            "
                                            >

                                                <i className="bi bi-file-earmark-pdf-fill"></i>

                                            </div>

                                            <div className="text-left">

                                                <div
                                                    className="
                                    text-sm
                                    font-semibold
                                    text-white
                                "
                                                >
                                                    Export PDF
                                                </div>

                                                <div
                                                    className="
                                    mt-1
                                    text-xs
                                    text-white/40
                                "
                                                >
                                                    Printable presentation format
                                                </div>

                                            </div>
                                        </div>

                                        <i
                                            className="
                            bi
                            bi-arrow-right

                            text-white/30

                            group-hover:text-white
                            group-hover:translate-x-1

                            transition-all
                        "
                                        />

                                    </button>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}