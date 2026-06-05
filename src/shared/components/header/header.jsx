import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {

    const navigate = useNavigate();

    const authStatus = useSelector(
        (state) => state.auth.status
    );

    const navItems = [
        {
            label: "Features",
            href: "#features",
        },
        {
            label: "Sharing",
            href: "#sharing",
        },
        {
            label: "Workflow",
            href: "#workflow",
        },
    ];

    return (


        <header

        className="
            sticky
            top-0

            z-30

            border-b
            border-white/6

    bg-[#060816]/92

    backdrop-blur-sm

    supports-[backdrop-filter]:bg-[#060816]/85
    "


        >

            <div
                className="
          max-w-7xl
          mx-auto

          px-6
          py-5

          flex
          items-center
          justify-between
        "
            >

                {/* LOGO */}
                <div
                    onClick={() => navigate("/")}
                    className="
            flex
            items-center
            gap-4

            cursor-pointer
          "
                >

                    <img
                        src="/logo.webp"
                        alt="Timeline"
                        className="
              w-14
              h-14

              rounded-3xl

              object-cover

              shadow-2xl
              shadow-fuchsia-500/30
            "
                    />

                    <div>

                        <div
                            className="
                text-3xl
                font-black
                tracking-tight
                text-white
              "
                        >
                            Timeline
                        </div>

                        <div
                            className="
                text-xs
                tracking-[0.25em]
                uppercase
                text-white/40
              "
                        >
                            Cinematic Planning
                        </div>
                    </div>
                </div>

                {/* CENTER NAV */}
                <nav
                    className="
            hidden
            lg:flex
            items-center
            gap-10
          "
                >

                    {
                        navItems.map((item) => (

                            <a
                                key={item.label}
                                href={item.href}
                                className="
                  text-sm
                  font-semibold

                  text-white/60
                  hover:text-white

                  transition-colors
                "
                            >
                                {item.label}
                            </a>
                        ))
                    }
                </nav>

                {/* RIGHT */}
                <div
                    className="
            flex
            items-center
            gap-4
          "
                >

                    {
                        authStatus ? (

                            <button
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                                className="
                  px-6
                  py-3

                  rounded-2xl

                  bg-gradient-to-r
                  from-fuchsia-500
                  to-cyan-400

                  text-white
                  font-semibold

                  shadow-xl
                  shadow-fuchsia-500/30

                  hover:scale-105

                  transition-all
                "
                            >

                                Open Workspace
                            </button>

                        ) : (

                            <>
                                <Link
                                    to="/login"
                                    className="
                    px-5
                    py-3

                    rounded-2xl

                    text-white/70
                    hover:text-white

                    transition-colors
                  "
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="
                    px-6
                    py-3

                    rounded-2xl

                    bg-gradient-to-r
                    from-fuchsia-500
                    to-cyan-400

                    text-white
                    font-semibold

                    shadow-xl
                    shadow-fuchsia-500/30

                    hover:scale-105

                    transition-all
                  "
                                >
                                    Start Free
                                </Link>
                            </>
                        )
                    }
                </div>
            </div>
        </header>
    );
}