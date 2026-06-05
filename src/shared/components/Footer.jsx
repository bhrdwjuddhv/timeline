import { motion } from "motion/react";

/*
=========================================
SOCIAL LINKS
=========================================
*/

const socialLinks = [

    {
        name: "GitHub",

        icon: "bi-github",

        url: "https://github.com/yourusername",

        glow: "hover:shadow-fuchsia-500/25",
    },

    {
        name: "LinkedIn",

        icon: "bi-linkedin",

        url: "https://linkedin.com/in/yourusername",

        glow: "hover:shadow-cyan-500/25",
    },

    {
        name: "Twitter",

        icon: "bi-twitter-x",

        url: "https://x.com/yourusername",

        glow: "hover:shadow-blue-500/25",
    },

    {
        name: "Instagram",

        icon: "bi-instagram",

        url: "https://instagram.com/yourusername",

        glow: "hover:shadow-pink-500/25",
    },
];

/*
=========================================
FOOTER
=========================================
*/

export default function Footer() {

    return (

        <footer
            className="
                relative

                border-t
                border-white/[0.06]

                bg-[#050816]

                overflow-hidden
            "
        >

            {/* BACKGROUND GLOWS */}

            <div
                className="
                    absolute
                    top-[-180px]
                    left-[-120px]

                    w-[360px]
                    h-[360px]

                    rounded-full

                    bg-fuchsia-500/10

                    blur-[140px]
                "
            />

            <div
                className="
                    absolute
                    bottom-[-200px]
                    right-[-100px]

                    w-[380px]
                    h-[380px]

                    rounded-full

                    bg-cyan-500/10

                    blur-[150px]
                "
            />

            {/* GRID OVERLAY */}

            <div
                className="
                    absolute
                    inset-0

                    opacity-[0.03]

                    [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]

                    [background-size:50px_50px]
                "
            />

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20,
                }}

                whileInView={{
                    opacity: 1,
                    y: 0,
                }}

                transition={{
                    duration: 0.5,
                }}

                viewport={{
                    once: true,
                }}

                className="
                    relative
                    z-10

                    max-w-7xl
                    mx-auto

                    px-6
                    py-16

                    flex
                    flex-col
                    lg:flex-row

                    items-start
                    lg:items-center

                    justify-between

                    gap-12
                "
            >

                {/* LEFT */}

                <div>

                    {/* BRAND */}

                    <div
                        className="
                            flex
                            items-center
                            gap-5
                        "
                    >

                        <div
                            className="
                                relative

                                w-16
                                h-16

                                rounded-[28px]

                                bg-gradient-to-br
                                from-fuchsia-500
                                via-pink-500
                                to-cyan-400

                                flex
                                items-center
                                justify-center

                                shadow-[0_0_60px_rgba(217,70,239,0.35)]
                            "
                        >

                            <div
                                className="
                                    absolute
                                    inset-[1px]

                                    rounded-[27px]

                                    bg-[#0b1020]
                                "
                            />

                            <i
                                className="
                                    bi
                                    bi-calendar-week-fill

                                    relative
                                    z-10

                                    text-white
                                    text-2xl
                                "
                            ></i>

                        </div>

                        <div>

                            <h2
                                className="
                                    text-3xl
                                    font-black
                                    tracking-tight

                                    text-white
                                "
                            >
                                Timeline
                            </h2>

                            <p
                                className="
                                    mt-1

                                    text-sm
                                    text-white/45
                                "
                            >
                                Plan visually. Sync seamlessly.
                            </p>

                        </div>
                    </div>

                    {/* DESCRIPTION */}

                    <p
                        className="
                            mt-7

                            max-w-xl

                            text-[15px]
                            leading-8

                            text-white/42
                        "
                    >
                        Built for creators, planners,
                        teams and digital workflows —
                        combining immersive visuals,
                        fluid organization and powerful
                        local-first performance.
                    </p>

                </div>

                {/* RIGHT */}

                <div
                    className="
                        flex
                        flex-col

                        items-start
                        lg:items-end

                        gap-7
                    "
                >

                    {/* SOCIALS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >

                        {socialLinks.map((social) => (

                            <a
                                key={social.name}

                                href={social.url}

                                target="_blank"

                                rel="noreferrer"

                                aria-label={social.name}

                                className={`
                                    group

                                    relative

                                    w-14
                                    h-14

                                    rounded-2xl

                                    border
                                    border-white/[0.08]

                                    bg-white/[0.03]

                                    flex
                                    items-center
                                    justify-center

                                    text-white/60
                                    text-lg

                                    shadow-lg

                                    hover:bg-white/[0.08]
                                    hover:text-white
                                    hover:-translate-y-1

                                    ${social.glow}

                                    transition-all
                                    duration-300
                                `}
                            >

                                <div
                                    className="
                                        absolute
                                        inset-0

                                        rounded-2xl

                                        bg-gradient-to-br
                                        from-white/[0.08]
                                        to-transparent

                                        opacity-0

                                        group-hover:opacity-100

                                        transition-opacity
                                    "
                                />

                                <i
                                    className={`
                                        bi
                                        ${social.icon}

                                        relative
                                        z-10
                                    `}
                                ></i>

                            </a>
                        ))}
                    </div>

                    {/* EMAIL */}

                    <a
                        href="mailto:yourmail@example.com"

                        className="
                            text-sm

                            text-white/55

                            hover:text-cyan-300

                            transition-colors
                        "
                    >
                        yourmail@example.com
                    </a>

                    {/* COPYRIGHT */}

                    <div
                        className="
                            text-xs
                            tracking-wide

                            text-white/25
                        "
                    >
                        © 2026 Timeline.
                        Crafted with precision.
                    </div>

                </div>
            </motion.div>
        </footer>
    );
}