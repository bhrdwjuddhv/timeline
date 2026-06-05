import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

/* PAGES */
import AuthCallbackPage from "@/app/authCallbackPage.jsx";

import LandingPage from "../landingPage.jsx";

import Dashboard from "../dashboard.jsx";

import PersonalCalendarPage from "../personalCalendarPage.jsx";

import DailyCalendarPage from "../dailyCalendarPage.jsx";

import CalendarsGalleryPage from "../calendarsGalleryPage.jsx";

import BrandCalendarPage from "../brandCalendarPage.jsx";

import Login from "@/app/loginPage.jsx";

import Signup from "@/app/signupPage.jsx";

/* AUTH LAYOUT */
import Protected from "@/app/AuthLayout.jsx";

export default function AppRoutes() {

    return (

        <Routes>

            {/* ========================================= */}
            {/* LANDING */}
            {/* ========================================= */}

            <Route
                path="/"

                element={
                    <LandingPage />
                }
            />

            {/* ========================================= */}
            {/* PUBLIC ONLY */}
            {/* ========================================= */}

            {/* LOGIN */}
            <Route
                path="/login"

                element={
                    <Protected authentication={false}>

                        <Login />

                    </Protected>
                }
            />

            {/* SIGNUP */}
            <Route
                path="/signup"

                element={
                    <Protected authentication={false}>

                        <Signup />

                    </Protected>
                }
            />

            <Route
                path="/auth/callback"

                element={
                    <AuthCallbackPage />
                }
            />

            {/* ========================================= */}
            {/* DASHBOARD */}
            {/* ========================================= */}

            <Route
                path="/dashboard"

                element={
                    <Protected authentication={true}>

                        <Dashboard />

                    </Protected>
                }
            >

                {/* DEFAULT */}
                <Route
                    index

                    element={
                        <Navigate
                            to="personal"
                            replace
                        />
                    }
                />

                {/* PERSONAL */}
                <Route
                    path="personal"

                    element={
                        <PersonalCalendarPage />
                    }
                />

                {/* GALLERY */}
                <Route
                    path="gallery"

                    element={
                        <CalendarsGalleryPage />
                    }
                />

                {/* BRAND CALENDAR */}
                <Route
                    path="calendar/:calendarId"

                    element={
                        <BrandCalendarPage />
                    }
                />

                {/* DAILY */}
                <Route
                    path="daily"

                    element={
                        <DailyCalendarPage />
                    }
                />
            </Route>
            {/*Shared Calendar*/}
            <Route
                path="/shared/calendar/:calendarId"

                element={
                    <BrandCalendarPage readOnly />
                }
            />

            {/* ========================================= */}
            {/* 404 */}
            {/* ========================================= */}

            <Route
                path="*"

                element={

                    <div
                        className="
                            min-h-screen

                            flex
                            items-center
                            justify-center

                            bg-[#050816]

                            text-white

                            px-6
                        "
                    >

                        <div className="text-center">

                            {/* 404 */}
                            <div
                                className="
                                    text-8xl
                                    font-black

                                    bg-gradient-to-r
                                    from-fuchsia-500
                                    to-cyan-400

                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                404
                            </div>

                            {/* TITLE */}
                            <h1
                                className="
                                    mt-6

                                    text-3xl
                                    font-bold
                                "
                            >
                                Page not found
                            </h1>

                            {/* TEXT */}
                            <p
                                className="
                                    mt-4

                                    text-white/60

                                    max-w-md
                                "
                            >
                                The page you’re
                                looking for doesn’t
                                exist or has been moved.
                            </p>

                            {/* BUTTON */}
                            <button

                                onClick={() =>
                                    window.location.href = "/"
                                }

                                className="
                                    mt-8

                                    px-8
                                    py-4

                                    rounded-2xl

                                    bg-gradient-to-r
                                    from-fuchsia-500
                                    to-cyan-400

                                    text-white
                                    font-semibold

                                    shadow-2xl
                                    shadow-fuchsia-500/30

                                    hover:scale-105

                                    transition-all
                                "
                            >
                                Back Home
                            </button>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}