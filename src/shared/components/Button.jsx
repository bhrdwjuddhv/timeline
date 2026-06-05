import React from "react";

function Button({
                    children,
                    type = "button",
                    variant = "primary",
                    className = "",
                    ...props
                }) {

    const baseStyles = `
        relative
        overflow-hidden
        inline-flex
        items-center
        justify-center
        gap-2
        px-6
        py-3.5
        rounded-2xl
        font-semibold
        tracking-wide
        transition-all
        duration-300
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
    `;

    const variants = {
        primary: `
            bg-gradient-to-r
            from-fuchsia-500
            via-pink-500
            to-orange-400
            text-white
            shadow-2xl
            shadow-fuchsia-500/20
            hover:scale-105
            hover:shadow-fuchsia-500/40
        `,

        secondary: `
            border
            border-black/5
            dark:border-white/10
            bg-white/60
            dark:bg-white/5
            backdrop-blur-2xl
            text-zinc-800
            dark:text-white/80
            hover:bg-white/80
            dark:hover:bg-white/10
            hover:scale-105
        `,

        danger: `
            bg-gradient-to-r
            from-red-500
            to-orange-500
            text-white
            shadow-xl
            shadow-red-500/20
            hover:scale-105
            hover:shadow-red-500/40
        `,

        ghost: `
            text-zinc-700
            dark:text-white/70
            hover:bg-black/5
            dark:hover:bg-white/5
        `,
    };

    return (
        <button
            type={type}
            className={`
                hover:cursor-pointer
                ${baseStyles}
                ${variants[variant]}
                ${className}
            `}
            {...props}
        >
            {/* Glow Layer */}
            <div
                className="
                    absolute
                    inset-0
                    opacity-0
                    hover:opacity-100
                    transition
                    duration-500
                    bg-gradient-to-r
                    from-white/10
                    via-transparent
                    to-white/10

                "
            />

            <span className="relative z-10">
                {children}
            </span>
        </button>
    );
}

export default Button;