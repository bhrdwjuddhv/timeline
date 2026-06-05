import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  createCalendar,
} from "../../../shared/utils/storageUtils.js";

import { useTheme } from "../../../app/providers/ThemeContext.jsx";

export default function CreateCalendarModal({
                                              isOpen,
                                              onClose,
                                              onCalendarCreated,
                                            }) {

  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    theme: "default",
    icon: "bi-calendar3",
    color: "#d946ef",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const themes = [
    {
      value: "default",
      label: "Default",
      color: "#d946ef",
    },
    {
      value: "ocean",
      label: "Ocean",
      color: "#06b6d4",
    },
    {
      value: "sunset",
      label: "Sunset",
      color: "#f97316",
    },
    {
      value: "forest",
      label: "Forest",
      color: "#10b981",
    },
    {
      value: "midnight",
      label: "Midnight",
      color: "#6366f1",
    },
  ];

  const icons = [
    "bi-calendar3",
    "bi-instagram",
    "bi-youtube",
    "bi-twitter-x",
    "bi-briefcase",
    "bi-lightning-charge",
    "bi-stars",
    "bi-kanban",
    "bi-rocket-takeoff",
    "bi-collection-play",
  ];

  const handleChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.name.trim()) return;

    setIsLoading(true);

    try {

      const selectedTheme = themes.find(
          (theme) => theme.value === formData.theme
      );

      const calendar = createCalendar({
        name: formData.name,
        theme: formData.theme,
        icon: formData.icon,
        color: selectedTheme?.color,
        description: formData.description,
      });

      onCalendarCreated?.(calendar);

      // RESET
      setFormData({
        name: "",
        theme: "default",
        icon: "bi-calendar3",
        color: "#d946ef",
        description: "",
      });

      onClose();

    } catch (error) {

      console.error(
          "Error creating calendar:",
          error
      );

    } finally {

      setIsLoading(false);
    }
  };

  return (
      <AnimatePresence>

        {
            isOpen && (

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
                              ? "border-white/10 bg-slate-900/80"
                              : "border-black/10 bg-white/80"
                      }
              `}
                  >

                    {/* GLOW */}
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

                    {/* HEADER */}
                    <div className="relative flex items-start justify-between mb-8">

                      <div>

                        <div
                            className="
                      w-16
                      h-16
                      rounded-3xl
                      bg-gradient-to-br
                      from-fuchsia-500
                      to-cyan-400
                      flex
                      items-center
                      justify-center
                      text-white
                      shadow-2xl
                      shadow-fuchsia-500/20
                      mb-5
                    "
                        >
                          <i className="bi bi-stars text-2xl"></i>
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
                          Create Calendar
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
                          Design a visually immersive workspace
                          for your content planning flow.
                        </p>
                      </div>

                      {/* CLOSE */}
                      <button
                          onClick={onClose}
                          className={`
                    w-12
                    h-12 hover:cursor-pointer
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
                            placeholder="e.g. YouTube Content Strategy"
                            autoFocus
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
                                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-fuchsia-400/50 focus:bg-white/10"
                                    : "border-black/10 bg-black/[0.03] text-slate-900 placeholder-slate-400 focus:border-fuchsia-400 focus:bg-white"
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
                            rows={3}
                            value={formData.description}
                            onChange={(e) =>
                                handleChange(
                                    "description",
                                    e.target.value
                                )
                            }
                            placeholder="Describe your workspace..."
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
                                    ? "border-white/10 bg-white/5 text-white placeholder-white/30 focus:border-cyan-400/50 focus:bg-white/10"
                                    : "border-black/10 bg-black/[0.03] text-slate-900 placeholder-slate-400 focus:border-cyan-400 focus:bg-white"
                            }
                    `}
                        />
                      </div>

                      {/* THEME + ICON */}
                      <div className="grid md:grid-cols-2 gap-6">

                        {/* THEME */}
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
                            Workspace Theme
                          </label>

                          <div className="grid grid-cols-2 gap-3">

                            {themes.map((themeItem) => (

                                <button
                                    type="button"
                                    key={themeItem.value}
                                    onClick={() =>
                                        handleChange(
                                            "theme",
                                            themeItem.value
                                        )
                                    }
                                    className={`
                            relative
                            overflow-hidden hover:cursor-pointer
                            px-4
                            py-4
                            rounded-2xl
                            border
                            transition-all
                            duration-300
                            ${
                                        formData.theme === themeItem.value
                                            ? isDark
                                                ? "border-white/20 bg-white/10"
                                                : "border-black/20 bg-black/[0.04]"
                                            : isDark
                                                ? "border-white/10 hover:bg-white/5"
                                                : "border-black/10 hover:bg-black/[0.03]"
                                    }
                          `}
                                >

                                  <div
                                      className="w-8 h-8 rounded-xl mb-3"
                                      style={{
                                        background:
                                        themeItem.color,
                                      }}
                                  />

                                  <div
                                      className={`
                              text-sm
                              font-medium
                              ${
                                          isDark
                                              ? "text-white"
                                              : "text-slate-900"
                                      }
                            `}
                                  >
                                    {themeItem.label}
                                  </div>
                                </button>
                            ))}
                          </div>
                        </div>

                        {/* ICON */}
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
                            Workspace Icon
                          </label>

                          <div className="grid grid-cols-5 gap-3">

                            {icons.map((icon) => (

                                <button
                                    type="button"
                                    key={icon}
                                    onClick={() =>
                                        handleChange("icon", icon)
                                    }
                                    className={`
                            w-14
                            h-14
                            rounded-2xl hover:cursor-pointer
                            flex
                            items-center
                            justify-center
                            text-xl
                            transition-all
                            duration-300
                            ${
                                        formData.icon === icon
                                            ? "bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-fuchsia-500/20 scale-105"
                                            : isDark
                                                ? "bg-white/5 hover:bg-white/10 text-white/70"
                                                : "bg-black/[0.03] hover:bg-black/[0.06] text-slate-700"
                                    }
                          `}
                                >
                                  <i className={`bi ${icon}`}></i>
                                </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-4 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className={`
                      flex-1
                      px-6
                      py-4 hover:cursor-pointer
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

                        <button
                            type="submit"
                            disabled={
                                !formData.name.trim() ||
                                isLoading
                            }
                            className="
                      flex-1
                      px-6 hover:cursor-pointer
                      py-4
                      rounded-2xl
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-fuchsia-500
                      via-pink-500
                      to-cyan-400
                      hover:scale-[1.02]
                      transition-all
                      duration-300
                      shadow-2xl
                      shadow-fuchsia-500/20
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                        >
                          {
                            isLoading
                                ? "Creating..."
                                : "Create Workspace"
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