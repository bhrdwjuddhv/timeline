import { motion } from "motion/react";

import Sidebar from "./sidebar.jsx";

import { useTheme } from "../../../app/providers/ThemeContext.jsx";

export default function DashboardLayout({
                                            children,
                                        }) {

    const { theme } = useTheme();

    const isDark =
        theme === "dark";

    return (

        <div
            className={`
        relative
        min-h-screen
        flex
        overflow-hidden

        transition-colors
        duration-300

        ${
                isDark
                    ? "bg-[#050816]"
                    : "bg-[#f6f7fb]"
            }
      `}
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
        "
            >

                {/* FUCHSIA GLOW */}

                <motion.div
                    animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.08, 0.14, 0.08],
                        x: [0, 40, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`
            absolute

            -top-[12%]
            -left-[12%]

            w-[38%]
            h-[38%]

            rounded-full

            blur-[80px]

            ${
                        isDark
                            ? "bg-fuchsia-500/10"
                            : "bg-fuchsia-500/5"
                    }
          `}
                />

                {/* CYAN GLOW */}

                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.08, 0.12, 0.08],
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 24,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className={`
            absolute

            bottom-[-12%]
            right-[-12%]

            w-[36%]
            h-[36%]

            rounded-full

            blur-[80px]

            ${
                        isDark
                            ? "bg-cyan-500/10"
                            : "bg-cyan-500/5"
                    }
          `}
                />

                {/* GRID */}

                <div
                    className={`
            absolute
            inset-0

            opacity-[0.02]

            ${
                        isDark
                            ? "bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)]"
                            : "bg-[linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)]"
                    }

            bg-[size:64px_64px]
          `}
                />

                {/* DARK OVERLAY */}

                <div
                    className="
            absolute
            inset-0

            bg-[#050816]/35
          "
                />
            </div>

            {/* ========================================= */}
            {/* SIDEBAR */}
            {/* ========================================= */}

            <div className="relative z-30">
                <Sidebar />
            </div>

            {/* ========================================= */}
            {/* MAIN CONTENT */}
            {/* ========================================= */}

            <main
                className={`
          relative
          z-10

          flex-1

          overflow-y-auto

          min-w-0

          transition-colors
          duration-300

          ${
                    isDark
                        ? "text-white"
                        : "text-slate-900"
                }
        `}
            >

                {/* ========================================= */}
                {/* TOP SPACER */}
                {/* ========================================= */}

                <div
                    className={`
            sticky
            top-0
            z-20

            h-20

            pointer-events-none

            ${
                        isDark
                            ? "bg-gradient-to-b from-[#050816]/90 to-transparent"
                            : "bg-gradient-to-b from-[#f6f7fb]/90 to-transparent"
                    }
          `}
                />

                {/* ========================================= */}
                {/* CONTENT WRAPPER */}
                {/* ========================================= */}

                <div
                    className="
            relative

            w-full
            max-w-[1800px]

            mx-auto

            px-4
            sm:px-6
            lg:px-10

            pb-10

            -mt-16
          "
                >

                    {/* ========================================= */}
                    {/* MAIN GLASS PANEL */}
                    {/* ========================================= */}

                    <div
                        className={`
              relative

              rounded-[40px]

              border

              overflow-hidden

              backdrop-blur-md

              shadow-2xl

              transition-all
              duration-300

              ${
                            isDark
                                ? "border-white/10 bg-[#0b1020]/80 shadow-black/40"
                                : "border-black/5 bg-white/85 shadow-slate-200/60"
                        }
            `}
                    >

                        {/* INNER GLOW */}

                        <div
                            className="
                absolute
                inset-0

                pointer-events-none

                bg-gradient-to-br
                from-fuchsia-500/[0.02]
                via-transparent
                to-cyan-500/[0.02]
              "
                        />

                        {/* CONTENT */}

                        <div
                            className="
                relative

                p-4
                sm:p-6
                lg:p-8

                min-h-screen
              "
                        >
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}