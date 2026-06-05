import React, { useId } from "react";

function Select(
    {
        options = [],
        label,
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

            <div className="relative">

                <select
                    ref={ref}
                    id={id}
                    className={`
                        w-full
                        appearance-none
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
                >
                    {options.map((option) => (
                        <option
                            key={option.value || option}
                            value={option.value || option}
                            className="bg-[#0b1020] text-white"
                        >
                            {option.label || option}
                        </option>
                    ))}
                </select>

                {/* Dropdown Icon */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-zinc-500
                        dark:text-white/40
                    "
                >
                    <i className="bi bi-chevron-down"></i>
                </div>
            </div>
        </div>
    );
}

export default React.forwardRef(Select);