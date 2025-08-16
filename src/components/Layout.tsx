import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout() {
    const { pathname } = useLocation();
    const tabs: { to: string; label: string; exact?: boolean }[] = [
        { to: "/", label: "recipes", exact: true },
        { to: "/saved", label: "saved" },
    ];

    return (
        <div className="min-h-dvh bg-background text-text">
            <header className="sticky top-0 z-10 border-b border-white/10 backdrop-blur-xl bg-black/20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/">
                        <img
                            src="/images/logo.png"
                            width={56}
                            height={56}
                            loading="eager"
                            decoding="async"
                            fetchPriority="high"
                            className="cursor-pointer w-32 sm:w-40"                            alt="Logo"
                        />
                    </Link>
                    <nav className="relative flex items-center gap-1 text-lg p-2 rounded-full bg-transparent outline-1 outline-white/20">
                        {tabs.map((t) => {
                            const isActive = t.exact
                                ? pathname === t.to
                                : pathname.startsWith(t.to);
                            return (
                                <div key={t.to} className="relative">
                                    <NavLink
                                        to={t.to}
                                        end={Boolean(t.exact)}
                                        className={
                                            isActive
                                                ? "relative z-10 px-3 py-1.5 !text-black/80"
                                                : "relative z-10 px-3 py-1.5 opacity-80 hover:opacity-100"
                                        }
                                    >
                                        {t.label}
                                    </NavLink>
                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.span
                                                layoutId="navHighlight"
                                                className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 40,
                                                    mass: 0.5,
                                                }}
                                                initial={{ opacity: 0.6 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-6">
                <Outlet />
            </main>
            <footer className="border-t border-[#2a2a2a] py-6 text-center opacity-70 text-md">
                Built with TheMealDB data. Designed and developed by{" "}
                <a
                    href="https://smikx.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className="text-[var(--color-primary)]">@Soumik</span>
                </a>
            </footer>
        </div>
    );
}
