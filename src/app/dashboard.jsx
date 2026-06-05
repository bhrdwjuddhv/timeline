import {
    useEffect,
} from "react";

import {
    Outlet,
} from "react-router-dom";

import { motion } from "motion/react";

import DashboardLayout from "../features/dashboard/components/dashboardLayout.jsx";

import {
    cleanupOrphanTasks,
} from "../shared/utils/calendarUtils.js";

export default function Dashboard() {

    /*
    =========================================
    CLEAN INVALID TASKS
    =========================================
    */

    useEffect(() => {

        cleanupOrphanTasks();

    }, []);

    /*
    =========================================
    MAIN UI
    =========================================
    */

    return (

        <DashboardLayout>

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
          w-full
          min-h-screen
        "
            >

                {/* PAGE CONTENT */}
                <Outlet />

            </motion.div>

        </DashboardLayout>
    );
}