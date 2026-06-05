import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import authService from "@/appwrite/auth.js";
import { login } from "@/store/AuthSlice.js";
import { setCalendars } from "@/store/calendarSlice.js";
import { setTasks } from "@/store/taskSlice.js";
import { bootstrapUserData } from "@/shared/utils/cloudBootstrap.js";

function readCached(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export default function AuthCallbackPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        async function completeOAuthLogin() {

            try {

                const params = new URLSearchParams(
                    window.location.search
                );

                const userId = params.get("userId");
                const secret = params.get("secret");

                if (!userId || !secret) {
                    navigate("/login");
                    return;
                }

                await authService.account.createSession(
                    userId,
                    secret
                );

                const user =
                    await authService.getCurrentUser();

                if (!user) {
                    navigate("/login");
                    return;
                }

                /*
                Bootstrap Appwrite data into Redux
                BEFORE dispatching auth state.
                This ensures the gallery has data
                the moment it first renders after
                the OAuth redirect.
                */
                try {
                    await bootstrapUserData(user.$id);
                } catch (bootstrapError) {
                    console.warn(
                        "OAuth bootstrap failed — using local cache:",
                        bootstrapError
                    );
                    dispatch(
                        setCalendars(
                            readCached(`timeline_calendars_${user.$id}`)
                        )
                    );
                    dispatch(
                        setTasks(
                            readCached(`timeline_tasks_${user.$id}`)
                        )
                    );
                }

                dispatch(login(user));
                navigate("/dashboard");

            } catch (error) {

                console.error("OAuth callback failed:", error);
                navigate("/login");
            }
        }

        completeOAuthLogin();

    }, [dispatch, navigate]);

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#050816]
                text-white
            "
        >

            <div className="text-center">

                <div
                    className="
                        w-14
                        h-14

                        mx-auto

                        rounded-full

                        border-4
                        border-white/20
                        border-t-fuchsia-400

                        animate-spin
                    "
                />

                <div
                    className="
                        mt-6
                        text-lg
                        font-semibold
                    "
                >
                    Completing login...
                </div>
            </div>
        </div>
    );
}
