import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useTheme } from "../../../app/providers/ThemeContext.jsx";

import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";

import { performLogout } from "@/shared/utils/logoutService.js";
import DeleteAccountModal from "./DeleteAccountModal.jsx";

const navItems = [
  {
    icon: "bi-person-badge",
    label: "Personal Calendar",
    path: "/dashboard/personal",
  },
  {
    icon: "bi-grid-1x2",
    label: "Calendars Gallery",
    path: "/dashboard/gallery",
  },
  {
    icon: "bi-clock-history",
    label: "Daily Calendar",
    path: "/dashboard/daily",
  },
];

export default function Sidebar() {

  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isDark = theme === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const menuRef = useRef(null);

  // CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {

    const handler = (e) => {

      if (
          menuRef.current &&
          !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };

  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await performLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
      <>
      <motion.aside
          initial={{ width: 88 }}
          whileHover={{ width: 280 }}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.4,
          }}
          className={`
        group
        z-50
        flex
        flex-col
        m-4
        rounded-3xl
        border
        shadow-2xl
        backdrop-blur-3xl
        overflow-hidden
        ${
              isDark
                  ? "border-white/10 bg-black/40"
                  : "border-black/5 bg-white/60"
          }
      `}
      >

        {/* LOGO */}
        <div
            className="px-6 py-8 flex items-center gap-4 cursor-pointer"
            onClick={() => navigate("/")}
        >

          <img
              src="/logo.webp"
              alt="Timeline"
              className="
            w-10
            h-10
            shrink-0
            rounded-2xl
            object-cover
            shadow-lg
            shadow-fuchsia-500/20
          "
          />

          <span
              className={`
            text-xl
            font-black
            tracking-tight
            whitespace-nowrap
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-300
            ${
                  isDark
                      ? "text-white"
                      : "text-slate-900"
              }
          `}
          >
          Timeline
        </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-2 space-y-2 relative z-10 overflow-hidden">

          {navItems.map((item) => (

              <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                      `
                flex
                items-center
                gap-4
                px-4
                py-3.5
                rounded-2xl
                text-sm
                font-semibold
                transition-all
                duration-300
                relative
                overflow-hidden
                ${
                          isActive
                              ? isDark
                                  ? "text-white bg-white/10"
                                  : "text-slate-900 bg-black/5"
                              : isDark
                                  ? "text-white/50 hover:text-white/80 hover:bg-white/5"
                                  : "text-slate-500 hover:text-slate-800 hover:bg-black/5"
                      }
              `
                  }
              >

                {({ isActive }) => (
                    <>

                      {isActive && (
                          <motion.div
                              layoutId="activeBorderSidebar"
                              className={`
                      absolute
                      left-0
                      top-1/4
                      bottom-1/4
                      w-1
                      rounded-r-full
                      ${
                                  isDark
                                      ? "bg-fuchsia-400"
                                      : "bg-fuchsia-500"
                              }
                    `}
                          />
                      )}

                      <i
                          className={`
                    bi
                    ${item.icon}
                    text-xl
                    shrink-0
                    transition-transform
                    duration-300
                    ${
                              isActive
                                  ? "scale-110 text-fuchsia-500"
                                  : "group-hover:scale-110"
                          }
                  `}
                      ></i>

                      <span
                          className="
                    whitespace-nowrap
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                  "
                      >
                  {item.label}
                </span>
                    </>
                )}
              </NavLink>
          ))}
        </nav>

        {/* THEME TOGGLE */}
        <div
            className={`
          p-4
          border-t
          overflow-hidden
          ${
                isDark
                    ? "border-white/10"
                    : "border-black/5"
            }
        `}
        >

          <button
              onClick={toggleTheme}
              className={`
            w-full
            flex hover:cursor-pointer
            items-center
            gap-4
            px-4
            py-3
            rounded-2xl
            text-sm
            font-semibold
            transition-all
            ${
                  isDark
                      ? "text-white hover:bg-white/10"
                      : "text-slate-900 hover:bg-black/5"
              }
          `}
          >

            <i
                className={`
              bi
              ${
                    isDark
                        ? "bi-sun-fill text-yellow-400"
                        : "bi-moon-fill text-violet-500"
                }
              text-xl
              shrink-0
            `}
            ></i>

            <span
                className="
              whitespace-nowrap
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
            "
            >
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
          </button>
        </div>

        {/* USER SECTION */}
        <div
            className={`
          border-t
          relative
          px-4
          py-4
          ${
                isDark
                    ? "border-white/10"
                    : "border-black/5"
            }
        `}
            ref={menuRef}
        >

          <div
              className={`
            flex
            items-center
            justify-between
            gap-3
            rounded-2xl
            px-3
            py-3
            ${
                  isDark
                      ? "bg-white/5"
                      : "bg-black/[0.03]"
              }
          `}
          >

            {/* USER */}
            <div className="flex items-center gap-3 min-w-0">

              <div
                  className="
                w-11
                h-11
                rounded-2xl
                bg-gradient-to-br
                from-fuchsia-500
                to-cyan-400
                flex
                items-center
                justify-center
                text-white
                font-bold
                shrink-0
              "
              >
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div
                  className="
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                min-w-0
              "
              >

                <div
                    className={`
                  text-sm
                  font-semibold
                  truncate
                  ${
                        isDark
                            ? "text-white"
                            : "text-slate-900"
                    }
                `}
                >
                  {userData?.name || "User"}
                </div>

                <div
                    className={`
                  text-xs
                  truncate
                  ${
                        isDark
                            ? "text-white/50"
                            : "text-slate-500"
                    }
                `}
                >
                  {userData?.email}
                </div>
              </div>
            </div>

            {/* MENU BUTTON */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`
              relative
              shrink-0
              w-10
              h-10 hover:cursor-pointer
              rounded-xl
              flex
              items-center
              justify-center
              transition-all
              ${
                    isDark
                        ? "hover:bg-white/10 text-white/70"
                        : "hover:bg-black/5 text-slate-700"
                }
            `}
            >
              <i className="bi bi-three-dots"></i>
            </button>
          </div>

          {/* DROPDOWN */}
          {
              menuOpen && (
                  <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 10,
                      }}
                      className={`
                absolute
                bottom-24
                right-4
                w-52
                rounded-3xl
                border
                backdrop-blur-3xl
                shadow-2xl
                overflow-hidden
                z-50
                ${
                          isDark
                              ? "border-white/10 bg-black/60"
                              : "border-black/5 bg-white/80"
                      }
              `}
                  >



                    <button
                        onClick={handleLogout}
                        className="
                  w-full
                  flex hover:cursor-pointer
                  items-center
                  gap-3
                  px-5
                  py-4
                  text-sm
                  font-medium
                  transition-all
                  text-red-500
                  hover:bg-red-500/10
                "
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>

                  </motion.div>
              )
          }
        </div>
      </motion.aside>

      <DeleteAccountModal
          isOpen={deleteAccountOpen}
          onClose={() => setDeleteAccountOpen(false)}
      />
      </>
  );
}