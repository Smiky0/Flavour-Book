import { useState } from "react";

type Props = {
    onSearch: (q: string) => void;
    initial?: string;
};

export default function SearchBar({ onSearch, initial = "" }: Props) {
    const [q, setQ] = useState(initial);
    return (
        <form
            className="flex items-center gap-2 w-full "
            onSubmit={(e) => {
                e.preventDefault();
                onSearch(q.trim());
            }}
        >
            <input
                aria-label="Search recipes"
                placeholder="Search dishes, ingredients, cuisines..."
                className="flex-1 px-4 py-3 rounded-full text-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[var(--color-primary)]"
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <button
                type="submit"
                aria-label="Search"
                title="Search"
                className="flex justify-center items-center cursor-pointer rounded-full bg-[var(--color-primary)] text-black hover:opacity-90 px-4 py-2"
            >
                <svg
                    className="size-6 md:hidden"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <span className="hidden md:inline text-xl font-semibold">
                    search
                </span>
            </button>
        </form>
    );
}
