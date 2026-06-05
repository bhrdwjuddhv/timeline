import {
    useSelector,
} from "react-redux";

import {
    Navigate,
    useLocation,
} from "react-router-dom";

export default function Protected({
                                      children,
                                      authentication = true,
                                  }) {

    /*
    =========================================
    REDUX
    =========================================
    */

    const authStatus =
        useSelector(
            (state) => state.auth.status
        );

    const userData =
        useSelector(
            (state) => state.auth.userData
        );

    const location =
        useLocation();

    /*
    =========================================
    AUTH RESTORING SAFETY
    =========================================

    Prevents redirect flicker while:
    - OAuth session restores
    - Redux updates
    - Appwrite fetches user
    */

    if (
        authStatus &&
        !userData
    ) {

        return null;
    }

    /*
    =========================================
    PROTECTED ROUTES
    =========================================
    */

    if (
        authentication &&
        !authStatus
    ) {

        return (
            <Navigate
                to="/login"
                replace

                state={{
                    from:
                    location.pathname,
                }}
            />
        );
    }

    /*
    =========================================
    PUBLIC ONLY ROUTES
    =========================================
    */

    if (
        !authentication &&
        authStatus
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    /*
    =========================================
    ALLOW ACCESS
    =========================================
    */

    return children;
}