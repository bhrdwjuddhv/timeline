import { Link } from "react-router-dom";

const LAST_UPDATED = "July 16, 2026";

export default function TermsPage() {

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

            <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 blur-[150px] pointer-events-none" />

            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />

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
                    Terms of Use
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
                            1. Acceptance of Terms
                        </h2>

                        <p>
                            By creating an account or using Timeline, you agree to these Terms of Use. If you do not agree, do not use the service.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            2. What Timeline Is
                        </h2>

                        <p>
                            Timeline is a visual calendar and task planning platform. It lets you create calendars, schedule tasks across dates, export your work as images or PDFs, and share read-only calendar links with others.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            3. Your Account
                        </h2>

                        <p>
                            You can create an account with an email address and password, or sign in with Google. You are responsible for maintaining the security of your account. Timeline uses Appwrite for authentication and data storage.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            4. Your Content
                        </h2>

                        <p>
                            You own your content. The calendars and tasks you create belong to you. Timeline stores them to provide the service and does not claim ownership over your content.
                        </p>

                        <p className="mt-4">
                            When you share a calendar via a public link, anyone with that link can view it in read-only mode. You control whether sharing is enabled.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            5. Acceptable Use
                        </h2>

                        <p>
                            You agree not to use Timeline for any unlawful purpose, to attempt to interfere with the service, to access other users' data without authorization, or to use automated scripts to abuse the platform.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            6. Account Deletion
                        </h2>

                        <p>
                            You can delete your account at any time from your account settings. Deletion permanently removes all your calendars, tasks, and account data. This action is irreversible.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            7. Service Availability
                        </h2>

                        <p>
                            Timeline is provided as-is. We do not guarantee uninterrupted availability. The service may be updated, changed, or discontinued at any time.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            8. Limitation of Liability
                        </h2>

                        <p>
                            To the fullest extent permitted by law, Timeline is not liable for any indirect, incidental, or consequential damages arising from your use of the service.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            9. Changes to These Terms
                        </h2>

                        <p>
                            We may update these terms from time to time. Continued use of the service after changes are posted constitutes your acceptance of the updated terms.
                        </p>

                    </section>

                    <section>

                        <h2 className="text-xl font-bold text-white mb-3">
                            10. Contact
                        </h2>

                        <p>
                            Questions about these terms? Reach out on{" "}
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

                    <Link to="/privacy" className="text-sm text-white/40 hover:text-white transition-colors">
                        Privacy Policy
                    </Link>

                    <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">
                        Back to Timeline
                    </Link>

                </div>

            </div>
        </div>
    );
}
