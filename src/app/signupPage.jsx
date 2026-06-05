import React, {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    motion,
} from "motion/react";

import {
    useForm,
} from "react-hook-form";

import authService from "../appwrite/auth.js";

import {
    login,
} from "../store/AuthSlice.js";

import {
    Input,
    Button,
    Header,
} from "../shared/components/index.js";

export default function SignupPage() {

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();

    const authStatus =
        useSelector(
            (state) => state.auth.status
        );

    /*
    =========================================
    REDIRECT AFTER AUTH
    =========================================
    */

    useEffect(() => {

        if (authStatus) {

            navigate(
                "/dashboard"
            );
        }

    }, [
        authStatus,
        navigate,
    ]);

    /*
    =========================================
    STATE
    =========================================
    */

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    /*
    =========================================
    FORM
    =========================================
    */

    const {
        register,
        handleSubmit,
        watch,
        formState: {
            errors,
        },
    } = useForm();

    /*
    =========================================
    CREATE ACCOUNT
    =========================================
    */

    const createAccount =
        async (data) => {

            setError("");

            setLoading(true);

            try {

                /*
                =========================================
                CREATE ACCOUNT
                =========================================
                */

                await authService.createAccount({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                });

                /*
                =========================================
                LOGIN AFTER SIGNUP
                =========================================
                */

                const session =
                    await authService.login({
                        email: data.email,
                        password: data.password,
                    });

                if (!session) {

                    throw new Error(
                        "Failed to create session"
                    );
                }

                /*
                =========================================
                GET USER
                =========================================
                */

                const userData =
                    await authService.getCurrentUser();

                if (!userData) {

                    throw new Error(
                        "Unable to fetch user"
                    );
                }

                /*
                =========================================
                UPDATE REDUX
                =========================================
                */

                dispatch(
                    login(userData)
                );

            } catch (error) {

                console.log(
                    "SIGNUP ERROR:",
                    error
                );

                setError(
                    error.message ||
                    "Signup failed"
                );

            } finally {

                setLoading(false);
            }
        };

    /*
    =========================================
    GOOGLE AUTH
    =========================================
    */

    const handleGoogleSignup =
        async () => {

            try {

                await authService
                    .loginWithGoogle();

            } catch (error) {

                console.log(error);

                setError(
                    "Google signup failed"
                );
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
                    left-[-120px]

                    w-[700px]
                    h-[700px]

                    rounded-full

                    bg-fuchsia-500/20

                    blur-[150px]
                "
                />

                <div
                    className="
                    absolute
                    bottom-[-200px]
                    right-[-120px]

                    w-[700px]
                    h-[700px]

                    rounded-full

                    bg-cyan-500/20

                    blur-[150px]
                "
                />

                {/* GRID */}
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
                    max-w-7xl

                    grid
                    lg:grid-cols-2

                    overflow-hidden

                    rounded-[42px]

                    border
                    border-white/10

                    bg-white/[0.03]

                    backdrop-blur-3xl

                    shadow-2xl
                "
                >

                    {/* LEFT SIDE */}
                    <div
                        className="
                        relative
                        overflow-hidden

                        p-16

                        hidden
                        lg:flex

                        flex-col
                        justify-between
                    "
                    >

                        <div
                            className="
                            absolute
                            inset-0

                            bg-gradient-to-br
                            from-fuchsia-500/10
                            to-cyan-500/10
                        "
                        />

                        <div className="relative z-10">

                            {/* LOGO */}
                            <div
                                className="
                                flex
                                items-center
                                gap-5
                            "
                            >

                                <motion.div

                                    whileHover={{
                                        scale: 1.06,
                                        rotate: 4,
                                    }}

                                    className="
                                    w-20
                                    h-20

                                    rounded-[28px]

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

                                <div>

                                    <div
                                        className="
                                        text-5xl
                                        font-black
                                        tracking-tight
                                        text-white
                                    "
                                    >
                                        Timeline
                                    </div>

                                    <div
                                        className="
                                        text-white/50
                                        mt-2
                                    "
                                    >
                                        Cinematic planning platform
                                    </div>
                                </div>
                            </div>

                            {/* HERO */}
                            <div className="mt-24">

                                <div
                                    className="
                                    inline-flex
                                    items-center
                                    gap-2

                                    px-4
                                    py-2

                                    rounded-full

                                    border
                                    border-white/10

                                    bg-white/[0.03]

                                    text-sm
                                    text-white/70
                                "
                                >

                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

                                    Realtime synced workspaces
                                </div>

                                <h1
                                    className="
                                    mt-10

                                    text-6xl
                                    font-black
                                    leading-[0.95]
                                    tracking-tight

                                    text-white
                                "
                                >

                                    Build
                                    <span
                                        className="
                                        bg-gradient-to-r
                                        from-fuchsia-400
                                        to-cyan-300

                                        bg-clip-text
                                        text-transparent
                                    "
                                    >
                                    {" "}visual systems
                                </span>

                                    <br />

                                    for creative work.
                                </h1>

                                <p
                                    className="
                                    mt-10

                                    text-xl
                                    leading-9

                                    text-white/60

                                    max-w-xl
                                "
                                >
                                    Organize campaigns,
                                    launches, social content,
                                    brand systems, and team
                                    workflows inside immersive
                                    cinematic calendars.
                                </p>
                            </div>
                        </div>

                        {/* FEATURES */}
                        <div
                            className="
                            relative
                            z-10

                            grid
                            grid-cols-2
                            gap-5
                        "
                        >

                            {[
                                {
                                    icon: "bi-share-fill",
                                    label: "One-click sharing",
                                },

                                {
                                    icon: "bi-cloud-check-fill",
                                    label: "Cloud synced",
                                },

                                {
                                    icon: "bi-file-earmark-image-fill",
                                    label: "Beautiful exports",
                                },

                                {
                                    icon: "bi-grid-1x2-fill",
                                    label: "Unlimited workspaces",
                                },
                            ].map((item) => (

                                <motion.div

                                    whileHover={{
                                        y: -4,
                                    }}

                                    key={item.label}

                                    className="
                                    rounded-3xl

                                    border
                                    border-white/10

                                    bg-white/[0.03]

                                    p-5
                                "
                                >

                                    <div
                                        className="
                                        w-12
                                        h-12

                                        rounded-2xl

                                        flex
                                        items-center
                                        justify-center

                                        text-white
                                        text-lg

                                        bg-gradient-to-br
                                        from-fuchsia-500
                                        to-cyan-400
                                    "
                                    >

                                        <i className={`bi ${item.icon}`}></i>

                                    </div>

                                    <div
                                        className="
                                        mt-4
                                        text-white/80
                                        font-semibold
                                    "
                                    >
                                        {item.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div
                        className="
                        p-8
                        md:p-14
                        xl:p-16
                    "
                    >

                        <div>

                            <h2
                                className="
                                text-5xl
                                font-black
                                tracking-tight
                                text-white
                            "
                            >
                                Create Account
                            </h2>

                            <p
                                className="
                                mt-5

                                text-lg
                                leading-8

                                text-white/60
                            "
                            >
                                Start building immersive
                                creative planning systems today.
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
                            "
                            >
                                {error}
                            </div>
                        )}

                        {/* GOOGLE */}
                        <button
                            type="button"

                            onClick={handleGoogleSignup}

                            className="
                            w-full

                            mt-10
                            hover:cursor-pointer
                            flex
                            items-center
                            justify-center
                            gap-4

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
                            onSubmit={handleSubmit(createAccount)}
                            className="space-y-7"
                        >

                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"

                                {...register("name", {
                                    required:
                                        "Name is required",
                                })}
                            />

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.name.message}
                                </p>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                placeholder="Enter your email"

                                {...register("email", {
                                    required:
                                        "Email is required",

                                    pattern: {
                                        value:
                                            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

                                        message:
                                            "Enter a valid email address",
                                    },
                                })}
                            />

                            {errors.email && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.email.message}
                                </p>
                            )}

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a password"

                                {...register("password", {
                                    required:
                                        "Password is required",

                                    minLength: {
                                        value: 8,

                                        message:
                                            "Minimum 8 characters required",
                                    },
                                })}
                            />

                            {errors.password && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.password.message}
                                </p>
                            )}

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm password"

                                {...register("confirmPassword", {
                                    validate: (value) =>
                                        value === watch("password") ||
                                        "Passwords do not match",
                                })}
                            />

                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.confirmPassword.message}
                                </p>
                            )}

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
                                        ? "Creating Account..."
                                        : "Create Account"
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

                            Already have an account?{" "}

                            <Link
                                to="/login"

                                className="
                                text-fuchsia-400
                                hover:text-fuchsia-300

                                font-semibold
                            "
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}