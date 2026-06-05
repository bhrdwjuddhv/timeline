import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Header from "../shared/components/Header/Header.jsx";

export default function LandingPage() {

  const navigate =
      useNavigate();

  const features = [
    {
      icon: "bi-share-fill",
      title: "One-click sharing",
      description:
          "Share read-only calendar links instantly with teammates, clients, or collaborators.",
    },

    {
      icon: "bi-cloud-check-fill",
      title: "Cloud synced",
      description:
          "Powered by Appwrite for secure realtime sync across devices.",
    },

    {
      icon: "bi-lightning-charge-fill",
      title: "Cinematic workflow",
      description:
          "Planning feels immersive, smooth, visual, and creatively energizing.",
    },

    {
      icon: "bi-file-earmark-image-fill",
      title: "Export anywhere",
      description:
          "Download beautiful PNG or PDF calendar snapshots in seconds.",
    },

    {
      icon: "bi-calendar3",
      title: "Multi-workspace",
      description:
          "Create unlimited calendars for campaigns, launches, content, or teams.",
    },

    {
      icon: "bi-phone-fill",
      title: "Responsive experience",
      description:
          "Optimized for desktop, tablets, and mobile planning workflows.",
    },
  ];

  return (

      <div
          className="
        relative
        min-h-screen
        overflow-hidden

        bg-[#030712]
        text-white
      "
      >

        {/* HEADER */}
        <Header />

        {/* ========================================= */}
        {/* AMBIENT BACKGROUND */}
        {/* ========================================= */}

        <div
            className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
        "
        >

          {/* PRIMARY GLOW */}
          <motion.div

              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.08, 0.15, 0.08],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}

              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="
            absolute
            top-[-10%]
            left-[5%]

            w-[800px]
            h-[800px]

            rounded-full
            blur-[150px]

            bg-fuchsia-500/20
          "
          />

          {/* SECONDARY GLOW */}
          <motion.div

              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.05, 0.12, 0.05],
                x: [0, -40, 0],
                y: [0, 50, 0],
              }}

              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "easeInOut",
              }}

              className="
            absolute
            bottom-[-10%]
            right-[0%]

            w-[700px]
            h-[700px]

            rounded-full
            blur-[140px]

            bg-cyan-500/20
          "
          />

          {/* GRID */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        {/* ========================================= */}
        {/* HERO */}
        {/* ========================================= */}

        <section
            className="
          relative
          z-10

          max-w-7xl
          mx-auto

          px-6

          pt-44
          pb-32
        "
        >

          <div
              className="
            grid
            lg:grid-cols-2

            gap-20
            items-center
          "
          >

            {/* LEFT */}
            <div>

              {/* BADGE */}
              <motion.div

                  initial={{
                    opacity: 0,
                    y: 10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  className="
                inline-flex
                items-center
                gap-3

                px-5
                py-3

                rounded-full

                border
                border-white/10

                bg-white/[0.03]
                backdrop-blur-2xl

                text-white/70
                text-sm
              "
              >

                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>

                Creative planning, reimagined.
              </motion.div>

              {/* TITLE */}
              <motion.h1

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.1,
                  }}

                  className="
                mt-10

                text-6xl
                md:text-7xl

                font-black
                tracking-tight
                leading-[0.95]
              "
              >

                Turn
                <span
                    className="
                  bg-gradient-to-r
                  from-fuchsia-400
                  via-pink-400
                  to-cyan-300

                  bg-clip-text
                  text-transparent
                "
                >
                {" "}content chaos
              </span>

                <br />

                into visual clarity.
              </motion.h1>

              {/* TEXT */}
              <motion.p

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.2,
                  }}

                  className="
                mt-10

                text-xl
                leading-9

                text-white/60

                max-w-2xl
              "
              >
                A cinematic calendar platform
                for creators, startups, teams,
                and agencies who want planning
                to feel immersive, fluid, and
                creatively energizing.
              </motion.p>

              {/* BUTTONS */}
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
                    delay: 0.3,
                  }}

                  className="
                flex
                flex-wrap
                gap-5

                mt-12
              "
              >

                <button

                    onClick={() =>
                        navigate("/signup")
                    }

                    className="
                  px-8
                  py-4

                  rounded-2xl

                  text-lg
                  font-bold

                  bg-gradient-to-r
                  from-fuchsia-500
                  via-pink-500
                  to-cyan-400
                  hover:cursor-pointer
                  shadow-2xl
                  shadow-fuchsia-500/30

                  hover:scale-105

                  transition-all
                "
                >

                  Start Planning
                </button>

                <button

                    onClick={() =>
                        navigate("/dashboard/gallery")
                    }

                    className="
                  px-8
                  py-4

                  rounded-2xl

                  text-lg
                  font-semibold
                  hover:cursor-pointer
                  border
                  border-white/10

                  bg-white/[0.03]
                  backdrop-blur-2xl

                  hover:bg-white/[0.05]

                  transition-all
                "
                >

                  Explore Workspace
                </button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div

                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                transition={{
                  delay: 0.25,
                }}

                className="
              relative
            "
            >

              {/* MAIN WINDOW */}
              <div
                  className="
                relative

                rounded-[42px]

                border
                border-white/10

                bg-white/[0.03]

                backdrop-blur-3xl

                p-6

                shadow-2xl
              "
              >

                {/* TOP BAR */}
                <div
                    className="
                  flex
                  items-center
                  justify-between

                  mb-8
                "
                >

                  <div className="flex gap-2">

                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>

                  </div>

                  <div className="text-white/60 font-semibold">
                    May 2026
                  </div>

                  <div></div>
                </div>

                {/* GRID */}
                <div
                    className="
                  grid
                  grid-cols-7
                  gap-3
                "
                >

                  {
                    Array.from({ length: 35 }).map(
                        (_, index) => (

                            <motion.div

                                key={index}

                                whileHover={{
                                  scale: 1.05,
                                }}

                                className={`
                          aspect-square

                          rounded-2xl

                          border

                          transition-all

                          ${
                                    index % 5 === 0
                                        ? "border-fuchsia-500/40 bg-fuchsia-500/10"
                                        : "border-white/5 bg-white/[0.02]"
                                }
                        `}
                            />
                        )
                    )
                  }
                </div>

                {/* FLOATING CARD */}
                <motion.div

                    animate={{
                      y: [-8, 8, -8],
                    }}

                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}

                    className="
                  absolute
                  -bottom-10
                  left-10

                  rounded-3xl

                  border
                  border-white/10

                  bg-black/50
                  backdrop-blur-3xl

                  px-6
                  py-5

                  shadow-2xl
                "
                >

                  <div className="flex items-center gap-5">

                    <div
                        className="
                      w-14
                      h-14

                      rounded-2xl

                      flex
                      items-center
                      justify-center

                      text-white
                      text-xl

                      bg-gradient-to-br
                      from-fuchsia-500
                      to-cyan-400
                    "
                    >

                      <i className="bi bi-instagram"></i>

                    </div>

                    <div>

                      <div className="font-bold text-lg">
                        Instagram Campaign
                      </div>

                      <div className="text-white/50 text-sm">
                        Scheduled • Friday
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================= */}
        {/* FEATURES */}
        {/* ========================================= */}

        <section
            id="features"
            className="
          relative
          z-10

          max-w-7xl
          mx-auto

          px-6
          py-32
        "
        >

          <div className="text-center">

            <div
                className="
              inline-flex
              items-center
              gap-2

              px-4
              py-2

              rounded-full

              bg-fuchsia-500/10
              border
              border-fuchsia-500/20

              text-fuchsia-300
              text-sm
            "
            >

              <i className="bi bi-stars"></i>

              Features
            </div>

            <h2
                className="
              mt-8

              text-5xl
              font-black
              leading-tight
            "
            >

              Everything needed for
              <span
                  className="
                bg-gradient-to-r
                from-fuchsia-400
                to-cyan-300

                bg-clip-text
                text-transparent
              "
              >
              {" "}modern planning.
            </span>
            </h2>
          </div>

          {/* GRID */}
          <div
              className="
            grid
            md:grid-cols-2
            xl:grid-cols-3

            gap-8

            mt-20
          "
          >

            {
              features.map((feature) => (

                  <motion.div

                      key={feature.title}

                      whileHover={{
                        y: -6,
                      }}

                      className="
                  relative
                  overflow-hidden

                  rounded-[32px]

                  border
                  border-white/10

                  bg-white/[0.03]

                  backdrop-blur-3xl

                  p-8
                "
                  >

                    {/* GLOW */}
                    <div
                        className="
                    absolute
                    inset-0

                    opacity-0
                    hover:opacity-100

                    transition-opacity
                    duration-700

                    bg-gradient-to-br
                    from-fuchsia-500/10
                    to-cyan-500/10
                  "
                    />

                    <div className="relative">

                      {/* ICON */}
                      <div
                          className="
                      w-16
                      h-16

                      rounded-3xl

                      flex
                      items-center
                      justify-center

                      text-2xl
                      text-white

                      bg-gradient-to-br
                      from-fuchsia-500
                      to-cyan-400

                      shadow-xl
                      shadow-fuchsia-500/20
                    "
                      >

                        <i className={`bi ${feature.icon}`}></i>

                      </div>

                      {/* TITLE */}
                      <h3
                          className="
                      mt-8

                      text-2xl
                      font-black
                    "
                      >
                        {feature.title}
                      </h3>

                      {/* TEXT */}
                      <p
                          className="
                      mt-5

                      text-white/60
                      leading-8
                    "
                      >
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
              ))
            }
          </div>
        </section>

        {/* ========================================= */}
        {/* SHARE SECTION */}
        {/* ========================================= */}

        <section
            id="sharing"
            className="
          relative
          z-10

          max-w-7xl
          mx-auto

          px-6
          py-32
        "
        >

          <div
              className="
            grid
            lg:grid-cols-2

            gap-20
            items-center
          "
          >

            {/* LEFT */}
            <div>

              <div
                  className="
                inline-flex
                items-center
                gap-2

                px-4
                py-2

                rounded-full

                bg-cyan-500/10
                border
                border-cyan-400/20

                text-cyan-300
                text-sm
              "
              >

                <i className="bi bi-share-fill"></i>

                Instant sharing
              </div>

              <h2
                  className="
                mt-8

                text-5xl
                font-black
                leading-tight
              "
              >

                Share calendars
                <span
                    className="
                  bg-gradient-to-r
                  from-fuchsia-400
                  to-cyan-300

                  bg-clip-text
                  text-transparent
                "
                >
                {" "}in one click.
              </span>
              </h2>

              <p
                  className="
                mt-8

                text-lg
                leading-8

                text-white/60
              "
              >
                Send beautiful read-only
                calendar links to teammates,
                clients, or collaborators
                instantly.
              </p>
            </div>

            {/* RIGHT */}
            <div
                className="
              rounded-[40px]

              border
              border-white/10

              bg-white/[0.03]

              backdrop-blur-3xl

              p-8
            "
            >

              <div
                  className="
                rounded-3xl

                border
                border-white/10

                bg-black/30

                p-5

                flex
                items-center
                justify-between
                gap-5
              "
              >

                <div
                    className="
                  flex-1
                  truncate

                  text-white/60
                "
                >
                  https://timeline.app/shared/calendar/marketing-q2
                </div>

                <button
                    className="
                  px-5
                  py-3

                  rounded-2xl

                  bg-gradient-to-r
                  from-fuchsia-500
                  to-cyan-400
                  hover:cursor-pointer
                  text-white
                  font-semibold
                "
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* CTA */}
        {/* ========================================= */}

        <section
            className="
          relative
          z-10

          max-w-7xl
          mx-auto

          px-6
          pb-40
        "
        >

          <div
              className="
            relative
            overflow-hidden

            rounded-[48px]

            border
            border-white/10

            bg-gradient-to-br
            from-fuchsia-500/10
            via-transparent
            to-cyan-500/10

            backdrop-blur-3xl

            p-16
            text-center
          "
          >

            {/* GLOW */}
            <div
                className="
              absolute
              inset-0

              opacity-40

              bg-gradient-to-br
              from-fuchsia-500/10
              to-cyan-500/10
            "
            />

            <div className="relative">

              <h2
                  className="
                text-5xl
                font-black
                leading-tight
              "
              >
                Ready to make planning
                <span
                    className="
                  bg-gradient-to-r
                  from-fuchsia-400
                  to-cyan-300

                  bg-clip-text
                  text-transparent
                "
                >
                {" "}feel cinematic?
              </span>
              </h2>

              <p
                  className="
                mt-8

                text-lg
                leading-8

                text-white/60

                max-w-3xl
                mx-auto
              "
              >
                Build immersive planning systems,
                organize creative workflows,
                collaborate visually, and turn
                chaos into clarity.
              </p>

              <button

                  onClick={() =>
                      navigate("/signup")
                  }

                  className="
                mt-12
                px-10
                py-5
                rounded-2xl

                text-lg
                font-bold

                bg-gradient-to-r
                from-fuchsia-500
                via-pink-500
                to-cyan-400
                hover:cursor-pointer
                shadow-2xl
                shadow-fuchsia-500/30

                hover:scale-105

                transition-all
              "
              >

                Start Free
              </button>
            </div>
          </div>
        </section>
      </div>
  );
}