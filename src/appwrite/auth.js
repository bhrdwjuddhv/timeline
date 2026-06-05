import conf from "@/conf/conf.js";

import {
    Client,
    Account,
    ID,
} from "appwrite";

export class AuthService {

    client = new Client();

    account;

    constructor() {

        this.client
            .setEndpoint(
                conf.appwriteUrl
            )
            .setProject(
                conf.appwriteProjectId
            );

        this.account = new Account(this.client);
    }

    /*
    ==================================================
    CREATE ACCOUNT
    ==================================================
    */

    async createAccount({
                            email,
                            password,
                            name,
                        }) {

        try {

            const userAccount =
                await this.account.create(
                    ID.unique(),
                    email,
                    password,
                    name
                );

            return userAccount;

        } catch (error) {

            console.log(
                "CREATE ACCOUNT ERROR:",
                error
            );

            throw error;
        }
    }

    /*
    ==================================================
    EMAIL LOGIN
    ==================================================
    */

    async login({
                    email,
                    password,
                }) {

        try {

            const session =
                await this.account.createEmailPasswordSession(
                    email,
                    password
                );

            console.log(
                "SESSION:",
                session
            );

            return session;

        } catch (error) {

            console.log(
                "LOGIN ERROR:",
                error
            );

            throw error;
        }
    }

    /*
    ==================================================
    GOOGLE LOGIN
    ==================================================
    */

    async loginWithGoogle() {

        try {

            const baseUrl =
                window.location.origin;


            return await this.account.createOAuth2Token(

                "google",

                `${baseUrl}/auth/callback`,

                `${baseUrl}/login`
            );

        } catch (error) {

            console.log(
                "GOOGLE LOGIN ERROR:",
                error
            );

            throw error;
        }
    }

    /*
    ==================================================
    GET CURRENT USER
    ==================================================
    */

    async getCurrentUser() {

        try {

            await new Promise(
                resolve => setTimeout(resolve, 500)
            );

            const user =
                await this.account.get();

            return user;

        } catch (error) {

            /*
            ==========================================
            NORMAL FOR GUEST USERS
            ==========================================
            */

            console.log(
                "NO ACTIVE SESSION" , error
            );

            return null;
        }
    }

    /*
    ==================================================
    LOGOUT
    ==================================================
    */

    async logout() {

        try {
            await this.account.deleteSessions();


            localStorage.removeItem(
                "timeline_tasks"
            );

            localStorage.removeItem(
                "timeline_calendars"
            );


            localStorage.removeItem(
                "timeline_theme"
            );

        } catch (error) {

            console.log(
                "LOGOUT ERROR:",
                error
            );

            throw error;
        }
    }
}

const authService =
    new AuthService();

export default authService;