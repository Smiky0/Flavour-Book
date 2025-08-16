import { useEffect } from "react";

export default function NotFoundPage() {
    // Basic SEO for 404: noindex and specific title/description
    useEffect(() => {
        document.title = "404 — Page Not Found | Flavour Book";
        const robots = ensureMeta("name", "robots");
        robots.setAttribute("content", "noindex, follow");
        const desc = ensureMeta("name", "description");
        desc.setAttribute(
            "content",
            "The page you requested was not found on Flavour Book."
        );
    }, []);
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="mx-10 my-auto w-full">
                <div className="fixed inset-0 -z-10 opacity-20" />
                <div className="flex flex-col items-center text-center gap-6 py-24">
                    <p className="text-7xl sm:text-9xl font-extrabold text-white/85">
                        404
                    </p>
                    <p className="text-2xl sm:text-3xl text-text/80 tracking-wide">
                        Page not found
                    </p>
                    <p className="text-text/60 text-lg max-w-xl">
                        The page you are looking for doesn’t exist or has been
                        moved.
                    </p>
                    <a
                        href="/"
                        className="text-xl inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/80 !text-black/80 hover:bg-transparent hover:!text-white/80 border border-white/20 transition-all duration-300 ease-in-out"
                    >
                        Go back home
                    </a>
                </div>
            </div>
        </div>
    );
}

function ensureMeta(attr: "name" | "property", value: string) {
    let el = document.querySelector(
        `meta[${attr}='${value}']`
    ) as HTMLMetaElement | null;
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
    }
    return el;
}
