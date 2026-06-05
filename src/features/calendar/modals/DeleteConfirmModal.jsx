import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../app/providers/ThemeContext.jsx";

export default function DeleteConfirmModal({
                                             isOpen,
                                             calendarName,
                                             onConfirm,
                                             onClose,
                                           }) {

  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
      <AnimatePresence>

        {
            isOpen && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              px-6
              bg-black/40
              backdrop-blur-xl
            "
                    onClick={onClose}
                >

                  <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.94,
                        y: 16,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.94,
                        y: 16,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.4,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`
                relative
                overflow-hidden
                w-full
                max-w-md
                rounded-[32px]
                border
                shadow-2xl
                backdrop-blur-3xl
                p-8
                ${
                          isDark
                              ? "border-white/10 bg-slate-900/85"
                              : "border-black/10 bg-white/85"
                      }
              `}
                  >

                    {/* GLOW */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none"></div>

                    <div className="relative flex flex-col items-center text-center">

                      {/* ICON */}
                      <div
                          className={`
                    w-20
                    h-20
                    rounded-3xl
                    flex
                    items-center
                    justify-center
                    text-4xl
                    shadow-2xl
                    mb-6
                    ${
                              isDark
                                  ? "bg-red-500/15 text-red-400 shadow-red-500/10"
                                  : "bg-red-500/10 text-red-500 shadow-red-500/10"
                          }
                  `}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </div>

                      {/* TITLE */}
                      <h2
                          className={`
                    text-3xl
                    font-black
                    tracking-tight
                    ${
                              isDark
                                  ? "text-white"
                                  : "text-slate-900"
                          }
                  `}
                      >
                        Delete Calendar
                      </h2>

                      {/* DESCRIPTION */}
                      <p
                          className={`
                    mt-4
                    text-sm
                    leading-7
                    max-w-sm
                    ${
                              isDark
                                  ? "text-white/55"
                                  : "text-slate-600"
                          }
                  `}
                      >
                        The workspace{" "}

                        <span
                            className={`
                      font-semibold
                      ${
                                isDark
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                    `}
                        >
                    {calendarName}
                  </span>

                        {" "}and all associated tasks,
                        schedules, and planning data will
                        be permanently removed.
                      </p>

                      {/* WARNING */}
                      <div
                          className={`
                    mt-6
                    w-full
                    rounded-2xl
                    border
                    px-5
                    py-4
                    text-sm
                    flex
                    items-start
                    gap-3
                    ${
                              isDark
                                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                                  : "border-red-500/15 bg-red-500/[0.06] text-red-600"
                          }
                  `}
                      >

                        <i className="bi bi-exclamation-triangle-fill mt-0.5"></i>

                        <div className="text-left leading-6">
                          This action cannot be undone.
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-4 w-full mt-8">

                        {/* CANCEL */}
                        <button
                            onClick={onClose}
                            className={`
                      flex-1
                      px-5
                      py-4
                      rounded-2xl
                      font-semibold
                      transition-all
                      duration-300
                      ${
                                isDark
                                    ? "bg-white/5 hover:bg-white/10 text-white"
                                    : "bg-black/[0.04] hover:bg-black/[0.08] text-slate-900"
                            }
                    `}
                        >
                          Cancel
                        </button>

                        {/* DELETE */}
                        <button
                            onClick={onConfirm}
                            className="
                      flex-1
                      px-5
                      py-4
                      rounded-2xl
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-red-500
                      to-orange-500
                      hover:scale-[1.02]
                      transition-all
                      duration-300
                      shadow-2xl
                      shadow-red-500/20
                    "
                        >
                          Delete Forever
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
            )
        }
      </AnimatePresence>
  );
}