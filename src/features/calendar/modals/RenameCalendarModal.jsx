import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  updateCalendar,
} from "../../../shared/utils/storageUtils.js";

import { useTheme } from "../../../app/providers/ThemeContext.jsx";

export default function RenameCalendarModal({
                                              isOpen,
                                              calendar,
                                              onClose,
                                              onCalendarRenamed,
                                            }) {

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    if (calendar && isOpen) {

      setFormData({
        name: calendar.name || "",
        description:
            calendar.description || "",
      });
    }

  }, [calendar, isOpen]);

  const handleChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
        !formData.name.trim() ||
        !calendar
    ) {
      return;
    }

    setIsLoading(true);

    try {

      const updates = {

        name: formData.name.trim(),

        description:
            formData.description.trim(),
      };

      updateCalendar(
          calendar.id,
          updates
      );

      onCalendarRenamed?.({
        ...calendar,
        ...updates,
      });

      onClose();

    } catch (error) {

      console.error(
          "Error renaming calendar:",
          error
      );

    } finally {

      setIsLoading(false);
    }
  };

  const isUnchanged =
      formData.name.trim() === calendar?.name &&
      formData.description.trim() ===
      (calendar?.description || "");

  return (
      <AnimatePresence>

        {
            isOpen &&
            calendar && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              px-6
              ${
                        isDark
                            ? "bg-black/50"
                            : "bg-white/40"
                    }
              backdrop-blur-xl
            `}
                    onClick={onClose}
                >

                  <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.94,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.94,
                        y: 20,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.45,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`
                relative
                overflow-hidden
                w-full
                max-w-2xl
                rounded-[36px]
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
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none"></div>

                    {/* HEADER */}
                    <div className="relative flex items-start justify-between mb-8">

                      <div>

                        <div
                            className="
                      w-16
                      h-16
                      rounded-3xl
                      bg-gradient-to-br
                      from-cyan-500
                      to-fuchsia-500
                      flex
                      items-center
                      justify-center
                      text-white
                      shadow-2xl
                      shadow-cyan-500/20
                      mb-5
                    "
                        >
                          <i className="bi bi-pencil-square text-2xl"></i>
                        </div>

                        <h2
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
                          Edit Calendar
                        </h2>

                        <p
                            className={`
                      mt-3
                      text-sm
                      leading-7
                      ${
                                isDark
                                    ? "text-white/50"
                                    : "text-slate-500"
                            }
                    `}
                        >
                          Rename and customize your
                          workspace identity.
                        </p>
                      </div>

                      {/* CLOSE */}
                      <button
                          onClick={onClose}
                          className={`
                    w-12
                    h-12
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    transition-all
                    ${
                              isDark
                                  ? "hover:bg-white/10 text-white/60"
                                  : "hover:bg-black/5 text-slate-600"
                          }
                  `}
                      >
                        <i className="bi bi-x-lg text-lg"></i>
                      </button>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="relative space-y-8"
                    >

                      {/* NAME */}
                      <div>

                        <label
                            className={`
                      block
                      text-sm
                      font-semibold
                      mb-3
                      ${
                                isDark
                                    ? "text-white/70"
                                    : "text-slate-700"
                            }
                    `}
                        >
                          Calendar Name
                        </label>

                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleChange(
                                    "name",
                                    e.target.value
                                )
                            }
                            autoFocus
                            placeholder="Workspace name..."
                            className={`
                      w-full
                      px-5
                      py-4
                      rounded-2xl
                      border
                      transition-all
                      duration-300
                      outline-none
                      ${
                                isDark
                                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                                    : "border-black/10 bg-black/[0.03] text-slate-900 placeholder-slate-400 focus:border-cyan-400 focus:bg-white"
                            }
                    `}
                        />
                      </div>

                      {/* DESCRIPTION */}
                      <div>

                        <label
                            className={`
                      block
                      text-sm
                      font-semibold
                      mb-3
                      ${
                                isDark
                                    ? "text-white/70"
                                    : "text-slate-700"
                            }
                    `}
                        >
                          Description
                        </label>

                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) =>
                                handleChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Describe this workspace..."
                            className={`
                      w-full
                      px-5
                      py-4
                      rounded-2xl
                      border
                      resize-none
                      transition-all
                      duration-300
                      outline-none
                      ${
                                isDark
                                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-fuchsia-400/50 focus:bg-white/10"
                                    : "border-black/10 bg-black/[0.03] text-slate-900 placeholder-slate-400 focus:border-fuchsia-400 focus:bg-white"
                            }
                    `}
                        />
                      </div>

                      {/* PREVIEW */}
                      <div
                          className={`
                    rounded-3xl
                    border
                    p-6
                    ${
                              isDark
                                  ? "border-white/10 bg-white/[0.03]"
                                  : "border-black/5 bg-black/[0.02]"
                          }
                  `}
                      >

                        <div className="flex items-center gap-4">

                          <div
                              className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-br
                        from-fuchsia-500
                        to-cyan-400
                        flex
                        items-center
                        justify-center
                        text-white
                        text-2xl
                        shadow-lg
                        shadow-fuchsia-500/20
                      "
                          >
                            <i className={`bi ${calendar.icon || "bi-calendar3"}`}></i>
                          </div>

                          <div>

                            <div
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
                              {
                                  formData.name ||
                                  "Untitled Workspace"
                              }
                            </div>

                            <div
                                className={`
                          text-sm
                          mt-1
                          ${
                                    isDark
                                        ? "text-white/50"
                                        : "text-slate-500"
                                }
                        `}
                            >
                              {
                                  formData.description ||
                                  "No description yet"
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-4 pt-2">

                        {/* CANCEL */}
                        <button
                            type="button"
                            onClick={onClose}
                            className={`
                      flex-1
                      px-6
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

                        {/* SAVE */}
                        <button
                            type="submit"
                            disabled={
                                !formData.name.trim() ||
                                isLoading ||
                                isUnchanged
                            }
                            className="
                      flex-1
                      px-6
                      py-4
                      rounded-2xl
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-cyan-500
                      via-blue-500
                      to-fuchsia-500
                      hover:scale-[1.02]
                      transition-all
                      duration-300
                      shadow-2xl
                      shadow-cyan-500/20
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                        >
                          {
                            isLoading
                                ? "Saving..."
                                : "Save Changes"
                          }
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
            )
        }
      </AnimatePresence>
  );
}