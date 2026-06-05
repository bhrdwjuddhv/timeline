import React, {
    useState,
} from "react";

import {
    Link,
    useNavigate,
    Navigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useForm,
} from "react-hook-form";

import {
    motion,
} from "motion/react";

import {
    login as authLogin,
} from "@/store/AuthSlice.js";

import {
    setCalendars,
} from "@/store/calendarSlice.js";

import {
    setTasks,
} from "@/store/taskSlice.js";

import authService from "@/appwrite/auth.js";

import {
    bootstrapUserData,
} from "@/shared/utils/cloudBootstrap.js";

import {
    Button,
    Input,
    Header
} from "@/shared/components/index.js";

/*
Read from localStorage only as a fallback when
Appwrite is unreachable at login time.
*/
function readCached(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function Login() {

    /*
    =========================================
    ALL HOOKS MUST BE DECLARED FIRST
    (before any conditional returns)
    =========================================
    */

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authStatus = useSelector(
        (state) => state.auth.status
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /*
    =========================================
    ALREADY AUTHENTICATED GUARD

    If the user visits /login while already
    logged in, redirect immediately.

    This fires only when authStatus was ALREADY
    true on mount (e.g. App.jsx bootstrap ran).
    During the login handler, auth state is
    updated AFTER bootstrap completes, so this
    fires with data already in the store.
    =========================================
    */

    if (authStatus) {
        return <Navigate to="/dashboard" replace />;
    }

    /*
    =========================================
    EMAIL LOGIN

    Critical order:
      1. Authenticate with Appwrite
      2. Get user object
      3. Hydrate Redux from Appwrite FIRST
         (bootstrapUserData) — data exists in
         the store before we ever navigate
      4. Dispatch auth state last — this
         triggers the <Navigate> guard above,
         redirecting with a populated store
    =========================================
    */

    const login =
        async (data) => {

            setError("");
            setLoading(true);

            try {

                const session =
                    await authService.login(data);

                if (!session) {
                    throw new Error(
                        "Failed to create session"
                    );
                }

                const userData =
                    await authService.getCurrentUser();

                if (!userData) {
                    throw new Error(
                        "Unable to fetch user"
                    );
                }

                /*
                Bootstrap Appwrite data into Redux
                BEFORE updating auth state so the
                calendar gallery has data ready the
                moment it first renders.
                */
                try {
                    await bootstrapUserData(userData.$id);
                } catch (bootstrapError) {
                    console.warn(
                        "Appwrite bootstrap failed — using local cache:",
                        bootstrapError
                    );
                    dispatch(
                        setCalendars(
                            readCached(
                                `timeline_calendars_${userData.$id}`
                            )
                        )
                    );
                    dispatch(
                        setTasks(
                            readCached(
                                `timeline_tasks_${userData.$id}`
                            )
                        )
                    );
                }

                /*
                Auth dispatch is intentionally last.
                Setting authStatus = true triggers a
                re-render; <Navigate> fires with a
                fully-hydrated Redux store.
                */
                dispatch(authLogin(userData));

            } catch (err) {

                console.log("LOGIN ERROR:", err);

                setError(
                    err.message || "Login failed"
                );

            } finally {

                setLoading(false);
            }
        };

    /*
    =========================================
    GOOGLE LOGIN
    =========================================
    */

    const handleGoogleLogin =
        async () => {

            try {

                await authService.loginWithGoogle();

            } catch (error) {

                console.log(error);

                setError("Google login failed");
            }
        };

    return (

        <div
            className="
            relative
            min-h-screen
            overflow-hidden
            bg-[#050816]
        "
        >

            {/* HEADER */}
            <Header />

            {/* PAGE */}
            <div
                className="
                relative
                z-10

                min-h-screen

                flex
                items-center
                justify-center

                px-6
                pt-32
                pb-16
            "
            >

                {/* GLOWS */}
                <div
                    className="
                    absolute
                    top-[-200px]
                    left-[-100px]

                    w-[600px]
                    h-[600px]

                    rounded-full

                    bg-fuchsia-500/20

                    blur-[140px]
                "
                />

                <div
                    className="
                    absolute
                    bottom-[-200px]
                    right-[-100px]

                    w-[600px]
                    h-[600px]

                    rounded-full

                    bg-cyan-500/20

                    blur-[140px]
                "
                />

                {/* CARD */}
                <motion.div

                    initial={{
                        opacity: 0,
                        y: 20,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        duration: 0.45,
                    }}

                    className="
                    relative
                    z-10

                    w-full
                    max-w-lg

                    rounded-[40px]

                    border
                    border-white/10

                    bg-white/[0.04]

                    backdrop-blur-3xl

                    shadow-2xl
                    shadow-fuchsia-500/10

                    p-10
                    md:p-14
                "
                >

                    {/* LOGO */}
                    <div className="text-center">

                        <motion.div

                            whileHover={{
                                scale: 1.06,
                                rotate: 4,
                            }}

                            className="
                            mx-auto

                            w-24
                            h-24

                            rounded-[32px]

                            overflow-hidden

                            shadow-2xl
                            shadow-fuchsia-500/30
                        "
                        >

                            <img
                                src="/logo.webp"
                                alt="Timeline"
                                className="w-full h-full object-cover"
                            />

                        </motion.div>

                        <h1
                            className="
                            mt-8

                            text-5xl
                            font-black
                            tracking-tight

                            text-white
                        "
                        >
                            Welcome Back
                        </h1>

                        <p
                            className="
                            mt-5

                            text-lg
                            leading-8

                            text-white/60
                        "
                        >
                            Continue building immersive
                            creative planning systems.
                        </p>
                    </div>

                    {/* ERROR */}
                    {error && (

                        <div
                            className="
                            mt-8

                            rounded-2xl

                            border
                            border-red-500/20

                            bg-red-500/10

                            px-5
                            py-4

                            text-red-400
                            text-sm
                        "
                        >
                            {error}
                        </div>
                    )}

                    {/* GOOGLE */}
                    <button
                        type="button"

                        onClick={handleGoogleLogin}

                        className="
                        w-full
                        mt-10
                        flex
                        items-center
                        justify-center
                        gap-4
                        hover:cursor-pointer
                        py-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        hover:bg-white/[0.06]
                        hover:scale-[1.02]
                        transition-all
                    "
                    >

                        <div
                            className="
                            w-10
                            h-10
                            rounded-full
                            bg-white
                            flex
                            items-center
                            justify-center
                        "
                        >

                            <i className="bi bi-google text-black"></i>

                        </div>

                        <span
                            className="
                            text-white
                            font-semibold
                            text-lg
                        "
                        >
                        Continue with Google
                    </span>
                    </button>

                    {/* DIVIDER */}
                    <div
                        className="
                        flex
                        items-center
                        gap-5

                        my-10
                    "
                    >

                        <div className="flex-1 h-px bg-white/10"></div>

                        <span
                            className="
                            text-sm
                            uppercase
                            tracking-[0.25em]

                            text-white/40
                        "
                        >
                        OR
                    </span>

                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit(login)}
                        className="space-y-7"
                    >

                        {/* EMAIL */}
                        <div>

                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"

                                {...register("email", {
                                    required: "Email is required",

                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                        message:
                                            "Enter a valid email address",
                                    },
                                })}
                            />

                            {errors.email && (

                                <p
                                    className="
                                    mt-2
                                    text-sm
                                    text-red-400
                                "
                                >
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"

                                {...register("password", {
                                    required:
                                        "Password is required",
                                })}
                            />

                            {errors.password && (

                                <p
                                    className="
                                    mt-2
                                    text-sm
                                    text-red-400
                                "
                                >
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <Button
                            type="submit"

                            className="
                            w-full
                            py-5
                            text-lg
                        "
                        >
                            {
                                loading
                                    ? "Signing In..."
                                    : "Sign In"
                            }
                        </Button>
                    </form>

                    {/* FOOTER */}
                    <div
                        className="
                        mt-10

                        text-center

                        text-white/50
                    "
                    >

                        Don't have an account?{" "}

                        <Link
                            to="/signup"

                            className="
                            text-fuchsia-400
                            hover:text-fuchsia-300

                            font-semibold

                            transition-colors
                        "
                        >
                            Create one
                        </Link>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}

export default Login;
