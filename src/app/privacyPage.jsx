import { Link } from "react-router-dom";

const LAST_UPDATED = "July 16, 2026";

export default function PrivacyPage() {

    return (

        <div
            className="
                min-h-screen
                bg-[#050816]
                text-white
                px-6
                py-20
            "
        >

            {/* GLOWS */}

            <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 blur-[150px] pointer-events-none" />

            <div
                className="
                    relative
                    z-10
                    max-w-3xl
                    mx-auto
                "
            >

                {/* BACK */}

                <Link
                    to="/"
                    className="
                        inline-flex
                        items-center
                        gap-2

                        text-sm
                        text-white/50
                        hover:text-white

                        transition-colors

                        mb-12
                    "
                >
                    <i className="bi bi-arrow-left"></i>
                    Back to Timeline
                </Link>

                {/* HEADER */}

                <h1
                    className="
                        text-5xl
                        font-black
                        tracking-tight
                    "
                >
                    Privacy Policy
                </h1>

                <p className="mt-4 text-white/40 text-sm">
                    Last updated: {LAST_UPDATED}
                </p>

                {/* BODY */}

                <div
                    className="
                        mt-12
                        space-y-10
                        text-white/70
                        leading-8
                        text-[15px]
                    "
                >

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            1. What We Collect
                        </h2>

                        <p>
                            When you create an account, Timeline collects your name, email address, and account credentials through Appwrite's authentication system. If you sign in with Google, we receive your name and email from Google's OAuth2 service. We do not collect payment information, phone numbers, or any other personal data beyond what is needed to run your account.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            2. Your Content
                        </h2>

                        <p>
                            The calendars and tasks you create are stored in Appwrite Databases, scoped to your user ID. Each task stores: title, description, platform tag, start date, optional end date, time, and completion status. This data belongs to you and is used solely to deliver the service.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            3. Local Storage
                        </h2>

                        <p>
                            Timeline caches your calendars and tasks in your browser's localStorage for offline access. This data is scoped to your user ID and never leaves your device except when syncing to Appwrite. Your theme preference is also stored locally.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            4. Sharing
                        </h2>

                        <p>
                            If you share a calendar via a public link, that calendar and its tasks become readable by anyone with the URL in read-only mode. Shared calendars are not indexed or promoted anywhere — only people who have the link can view them. You control this by toggling the share feature.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            5. No Ads, No Analytics, No Data Selling
                        </h2>

                        <p>
                            Timeline does not run advertisements, does not use analytics tracking services, and does not sell, rent, or share your data with third parties for marketing purposes. Your data is used only to provide the service to you.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            6. Third-Party Services
                        </h2>

                        <p>
                            Timeline uses Appwrite (appwrite.io) as its backend for authentication and data storage. Your data is subject to Appwrite's own privacy and security practices. Google's OAuth2 service is used for Google sign-in.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            7. Account Deletion
                        </h2>

                        <p>
                            You can delete your account at any time. This permanently removes all your tasks, calendars, and account data from Appwrite's servers and from your browser's local storage. There is no way to recover this data after deletion.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            8. Data Retention
                        </h2>

                        <p>
                            Your data is retained for as long as your account is active. If you delete your account, all associated data is deleted. We do not retain backups of individual user data after deletion.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            9. Changes to This Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy from time to time. Continued use of Timeline after changes are posted indicates your acceptance of the updated policy.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            10. Contact
                        </h2>

                        <p>
                            Questions about your data or this policy? Reach out on{" "}
                            <a
                                href="https://github.com/bhrdwjuddhv"
                                target="_blank"
                                rel="noreferrer"
                                className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                            >
                                GitHub
                            </a>{" "}
                            or{" "}
                            <a
                                href="https://www.linkedin.com/in/bhrdwjuddhv/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                            >
                                LinkedIn
                            </a>.
                        </p>

                    </section>

                </div>

                {/* FOOTER LINKS */}

                <div className="mt-16 pt-8 border-t border-white/10 flex gap-6">

                    <Link to="/terms" className="text-sm text-white/40 hover:text-white transition-colors">
                        Terms of Use
                    </Link>

                    <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">
                        Back to Timeline
                    </Link>

                </div>

            </div>
        </div>
    );
}
