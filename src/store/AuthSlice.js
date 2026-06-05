import {
    createSlice,
} from "@reduxjs/toolkit";

const initialState = {

    status: false,

    userData: null,
};

const authSlice =
    createSlice({

        name: "auth",

        initialState,

        reducers: {

            /*
            =========================================
            LOGIN
            =========================================
            */

            login: (
                state,
                action
            ) => {

                state.status = true;

                state.userData =
                    action.payload;
            },

            /*
            =========================================
            LOGOUT
            =========================================
            */

            logout: (
                state
            ) => {

                state.status = false;

                state.userData = null;
            },
        },
    });

export const {
    login,
    logout,
} = authSlice.actions;

export default authSlice.reducer;