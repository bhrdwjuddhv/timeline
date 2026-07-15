import { useState, useEffect } from "react";

function useIsMobile() {

    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia("(max-width: 767px)").matches
    );

    useEffect(() => {

        const mq = window.matchMedia("(max-width: 767px)");

        const handler = (e) => setIsMobile(e.matches);

        mq.addEventListener("change", handler);

        return () => mq.removeEventListener("change", handler);

    }, []);

    return isMobile;
}

export default function MobileGate({ children }) {

    const isMobile = useIsMobile();

    if (!isMobile) return children;

    return (

        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#050816]
                overflow-hidden
                relative
                px-6
            "
        >

            {/* GLOWS */}

            <div
                className="
                    absolute
                    w-[500px]
                    h-[500px]

                    rounded-full

                    bg-fuchsia-500/20

                    blur-[120px]
                "
            />

            <div
                className="
                    absolute
                    bottom-0
                    right-0

                    w-[400px]
                    h-[400px]

                    rounded-full

                    bg-cyan-500/20

                    blur-[120px]
                "
            />

            {/* CONTENT */}

            <div
                className="
                    relative
                    z-10

                    flex
                    flex-col
                    items-center
                    text-center

                    max-w-sm
                "
            >

                {/* ICON */}

                <div
                    className="
                        w-24
                        h-24

                        rounded-[32px]

                        bg-gradient-to-br
                        from-fuchsia-500
                        via-pink-500
                        to-cyan-400

                        flex
                        items-center
                        justify-center

                        shadow-2xl
                        shadow-fuchsia-500/30
                    "
                >

                    <i className="bi bi-display text-white text-4xl"></i>

                </div>

                {/* TITLE */}

                <h1
                    className="
                        mt-8

                        text-3xl
                        font-black
                        tracking-tight

                        text-white
                    "
                >
                    Open on desktop
                </h1>

                {/* TEXT */}

                <p
                    className="
                        mt-4

                        text-white/50
                        leading-7
                    "
                >
                    Timeline's workspace needs a bigger screen.
                    Open it on a laptop or desktop.
                </p>

            </div>
        </div>
    );
}
