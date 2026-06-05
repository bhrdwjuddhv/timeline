import React from "react";
import { useNavigate } from "react-router-dom";
import { performLogout } from "@/shared/utils/logoutService.js";

function LogoutBtn() {

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await performLogout();
            navigate("/login");
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <button
            onClick={logoutHandler}
            className="
                group
                relative
                overflow-hidden
                px-5
                py-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                hover:bg-white/10
                transition-all
                duration-300
                hover:scale-105
                shadow-lg
                hover:shadow-fuchsia-500/20
                flex
                items-center
                gap-3
                text-white/80
                hover:text-white
            "
        >
            {/* Glow */}
            <div className="
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition
                duration-500
                bg-gradient-to-r
                from-fuchsia-500/10
                via-transparent
                to-cyan-500/10
            " />

            {/* Icon */}
            <div className="
                relative
                z-10
                w-9
                h-9
                rounded-xl
                bg-gradient-to-br
                from-fuchsia-500
                to-orange-400
                flex
                items-center
                justify-center
                shadow-lg
                shadow-fuchsia-500/20
            ">
                <i className="bi bi-box-arrow-right text-white text-sm"></i>
            </div>

            {/* Text */}
            <span className="relative z-10 font-semibold tracking-wide">
                Logout
            </span>
        </button>
    );
}

export default LogoutBtn;
