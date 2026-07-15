import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import authService from "@/appwrite/auth.js";
import { logout } from "@/store/AuthSlice.js";

export default function AcceptTermsModal({ onAccepted }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAccept = async () => {

        setLoading(true);
        setError("");

        try {

            await authService.updateTermsAccepted();

            onAccepted();

        } catch (err) {

            setError(
                "Failed to save acceptance. Please try again."
            );

            setLoading(false);
        }
    };

    const handleLogout = async () => {

        try {

            await authService.logout();

        } catch {

            /* ignore */

        } finally {

            dispatch(logout());
            navigate("/login");
        }
    };

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                px-6
                bg-black/60
                backdrop-blur-xl
            "
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
                transition={{
                    type: "spring",
                    bounce: 0.15,
                    duration: 0.4,
                }}
                className="
                    relative
                    overflow-hidden

                    w-full
                    max-w-md

                    rounded-[32px]

                    border
                    border-white/10

                    shadow-2xl
                    backdrop-blur-3xl

                    p-8

                    bg-slate-900/90
                "
            >

                {/* GLOW */}

                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-transparent to-cyan-500/10 pointer-events-none" />

                <div className="relative flex flex-col items-center text-center">

                    {/* ICON */}

                    <div
                        className="
                            w-20
                            h-20

                            rounded-3xl

                            flex
                            items-center
                            justify-center

                            text-4xl

                            shadow-2xl
                            shadow-fuchsia-500/10

                            mb-6

                            bg-fuchsia-500/15
                            text-fuchsia-400
                        "
                    >
                        <i className="bi bi-file-earmark-check-fill" />
                    </div>

                    {/* TITLE */}

                    <h2
                        className="
                            text-3xl
                            font-black
                            tracking-tight
                            text-white
                        "
                    >
                        Review & Accept
                    </h2>

                    {/* TEXT */}

                    <p
                        className="
                            mt-4
                            text-sm
                            leading-7
                            max-w-sm
                            text-white/55
                        "
                    >
                        Before using Timeline, please review and accept the Terms of Use and Privacy Policy.
                    </p>

                    {/* LINKS */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            gap-5
                        "
                    >

                        <Link
                            to="/terms"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                text-sm
                                text-fuchsia-400
                                hover:text-fuchsia-300
                                font-semibold
                                transition-colors
                            "
                        >
                            Terms of Use →
                        </Link>

                        <Link
                            to="/privacy"
                            target="_blank"
                            rel="noreferrer"
                            className="
                                text-sm
                                text-cyan-400
                                hover:text-cyan-300
                                font-semibold
                                transition-colors
                            "
                        >
                            Privacy Policy →
                        </Link>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <p className="mt-4 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {/* BUTTONS */}

                    <div className="flex gap-4 w-full mt-8">

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="
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
                                bg-white/5
                                hover:bg-white/10
                                text-white
                            "
                        >
                            Log Out
                        </button>

                        <button
                            onClick={handleAccept}
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
                                from-fuchsia-500
                                to-cyan-500
                                hover:scale-[1.02]
                                transition-all
                                duration-300
                                shadow-2xl
                                shadow-fuchsia-500/20
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                disabled:scale-100
                            "
                        >
                            {loading ? "Saving..." : "I Agree"}
                        </button>

                    </div>

                </div>
            </motion.div>
        </div>
    );
}
