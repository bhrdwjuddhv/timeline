import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "../../../app/providers/ThemeContext.jsx";
import { deleteAccount } from "../../../shared/utils/deleteAccountService.js";

export default function DeleteAccountModal({ isOpen, onClose }) {

    const { theme } = useTheme();
    const isDark = theme === "dark";
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        if (loading) return;
        setStep(1);
        setEmail("");
        setError("");
        onClose();
    };

    const handleEmailVerify = () => {
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        if (email.trim().toLowerCase() !== (userData?.email || "").toLowerCase()) {
            setError("Email does not match your account. Please try again.");
            return;
        }
        setError("");
        setStep(2);
    };

    const handleFinalDelete = async () => {
        setLoading(true);
        setError("");
        try {
            await deleteAccount(userData.$id);
            navigate("/login");
        } catch (err) {
            setError(err.message || "Failed to delete account. Please try again.");
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 16 }}
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
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
                            ${isDark
                                ? "border-white/10 bg-slate-900/85"
                                : "border-black/10 bg-white/85"
                            }
                        `}
                    >

                        {/* GLOW */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 pointer-events-none" />

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
                                    ${isDark
                                        ? "bg-red-500/15 text-red-400 shadow-red-500/10"
                                        : "bg-red-500/10 text-red-500 shadow-red-500/10"
                                    }
                                `}
                            >
                                <i className="bi bi-person-x-fill" />
                            </div>

                            {step === 1 ? (
                                <>
                                    {/* STEP 1 — EMAIL VERIFICATION */}

                                    <h2
                                        className={`
                                            text-3xl
                                            font-black
                                            tracking-tight
                                            ${isDark ? "text-white" : "text-slate-900"}
                                        `}
                                    >
                                        Delete Account
                                    </h2>

                                    <p
                                        className={`
                                            mt-4
                                            text-sm
                                            leading-7
                                            max-w-sm
                                            ${isDark ? "text-white/55" : "text-slate-600"}
                                        `}
                                    >
                                        Deleting your account will permanently remove all calendars, tasks, settings, and account data. This action cannot be undone.
                                    </p>

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
                                            ${isDark
                                                ? "border-red-500/20 bg-red-500/10 text-red-300"
                                                : "border-red-500/15 bg-red-500/[0.06] text-red-600"
                                            }
                                        `}
                                    >
                                        <i className="bi bi-exclamation-triangle-fill mt-0.5" />
                                        <div className="text-left leading-6">
                                            To confirm, enter your account email address below.
                                        </div>
                                    </div>

                                    <div className="w-full mt-6">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setError("");
                                            }}
                                            placeholder={userData?.email || "Enter your email"}
                                            disabled={loading}
                                            className={`
                                                w-full
                                                px-5
                                                py-4
                                                rounded-2xl
                                                border
                                                text-sm
                                                outline-none
                                                transition-all
                                                ${isDark
                                                    ? "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500/50"
                                                    : "bg-black/[0.03] border-black/10 text-slate-900 placeholder:text-slate-400 focus:border-red-400"
                                                }
                                            `}
                                        />
                                        {error && (
                                            <p className="mt-2 text-sm text-red-400 text-left">
                                                {error}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-4 w-full mt-6">

                                        <button
                                            onClick={handleClose}
                                            className={`
                                                flex-1
                                                px-5
                                                py-4
                                                rounded-2xl
                                                font-semibold
                                                transition-all
                                                duration-300
                                                hover:cursor-pointer
                                                ${isDark
                                                    ? "bg-white/5 hover:bg-white/10 text-white"
                                                    : "bg-black/[0.04] hover:bg-black/[0.08] text-slate-900"
                                                }
                                            `}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleEmailVerify}
                                            className="
                                                flex-1
                                                px-5
                                                py-4
                                                rounded-2xl
                                                font-semibold
                                                text-white
                                                hover:cursor-pointer
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
                                            Delete Account
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* STEP 2 — FINAL CONFIRMATION */}

                                    <h2
                                        className={`
                                            text-3xl
                                            font-black
                                            tracking-tight
                                            ${isDark ? "text-white" : "text-slate-900"}
                                        `}
                                    >
                                        Are you absolutely sure?
                                    </h2>

                                    <p
                                        className={`
                                            mt-4
                                            text-sm
                                            leading-7
                                            max-w-sm
                                            ${isDark ? "text-white/55" : "text-slate-600"}
                                        `}
                                    >
                                        This action cannot be undone. All your calendars, tasks, and account data will be permanently deleted.
                                    </p>

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
                                            ${isDark
                                                ? "border-red-500/20 bg-red-500/10 text-red-300"
                                                : "border-red-500/15 bg-red-500/[0.06] text-red-600"
                                            }
                                        `}
                                    >
                                        <i className="bi bi-exclamation-triangle-fill mt-0.5" />
                                        <div className="text-left leading-6">
                                            All calendars, tasks, and account data will be permanently removed. There is no way to recover this data.
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="mt-4 text-sm text-red-400">
                                            {error}
                                        </p>
                                    )}

                                    <div className="flex gap-4 w-full mt-8">

                                        <button
                                            onClick={() => { setStep(1); setError(""); }}
                                            disabled={loading}
                                            className={`
                                                flex-1
                                                px-5
                                                py-4
                                                rounded-2xl
                                                font-semibold
                                                transition-all
                                                duration-300
                                                hover:cursor-pointer
                                                disabled:opacity-50
                                                disabled:cursor-not-allowed
                                                ${isDark
                                                    ? "bg-white/5 hover:bg-white/10 text-white"
                                                    : "bg-black/[0.04] hover:bg-black/[0.08] text-slate-900"
                                                }
                                            `}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleFinalDelete}
                                            disabled={loading}
                                            className="
                                                flex-1
                                                px-5
                                                py-4
                                                rounded-2xl
                                                font-semibold
                                                text-white
                                                hover:cursor-pointer
                                                bg-gradient-to-r
                                                from-red-500
                                                to-orange-500
                                                hover:scale-[1.02]
                                                transition-all
                                                duration-300
                                                shadow-2xl
                                                shadow-red-500/20
                                                disabled:opacity-50
                                                disabled:cursor-not-allowed
                                                disabled:scale-100
                                            "
                                        >
                                            {loading ? "Deleting..." : "Yes, Delete Everything"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
