import React, { useId } from "react";

const Input = React.forwardRef(function Input(
    {
        label,
        type = "text",
        className = "",
        ...props
    },
    ref
) {
    const id = useId();

    return (
        <div className="w-full">

            {label && (
                <label
                    htmlFor={id}
                    className="
                        inline-block
                        mb-3
                        text-sm
                        font-semibold
                        tracking-wide
                        text-zinc-700
                        dark:text-white/70
                    "
                >
                    {label}
                </label>
            )}

            <input
                type={type}
                id={id}
                ref={ref}
                className={`
                    w-full
                    px-5
                    py-4
                    rounded-2xl
                    border
                    border-black/5
                    dark:border-white/10
                    bg-white/60
                    dark:bg-white/5
                    backdrop-blur-2xl
                    text-zinc-900
                    dark:text-white
                    placeholder:text-zinc-400
                    dark:placeholder:text-white/30
                    outline-none
                    transition-all
                    duration-300
                    focus:border-fuchsia-400/50
                    focus:ring-4
                    focus:ring-fuchsia-500/10
                    focus:bg-white/80
                    dark:focus:bg-white/10
                    shadow-lg
                    hover:border-fuchsia-400/20
                    ${className}
                `}
                {...props}
            />
        </div>
    );
});

export default Input;