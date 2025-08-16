import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { listSaved, removeSaved, upsertSaved } from "../services/storage";
import type { SavedEntry, SavedStatus } from "../types";
import ImageWithFallback from "../components/ImageWithFallback";
import AnimatedFood from "../components/AnimatedFood";

export default function Saved() {
    const [items, setItems] = useState<SavedEntry[]>([]);
    const [filter, setFilter] = useState<"all" | SavedStatus>("all");

    function refresh() {
        setItems(listSaved());
    }

    useEffect(() => {
        refresh();
    }, []);

    const counts = useMemo(() => {
        return items.reduce(
            (acc, it) => {
                acc.total++;
                acc[it.status]++;
                return acc;
            },
            { total: 0, willCook: 0, cooked: 0, liked: 0 } as {
                total: number;
                willCook: number;
                cooked: number;
                liked: number;
            }
        );
    }, [items]);

    const visible = useMemo(() => {
        if (filter === "all") return items;
        return items.filter((i) => i.status === filter);
    }, [items, filter]);

    function setStatus(id: string, status: SavedStatus) {
        const entry = items.find((i) => i.recipe.id === id);
        if (!entry) return;
        upsertSaved(entry.recipe, status);
        refresh();
    }

    function remove(id: string) {
        removeSaved(id);
        refresh();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        Saved
                    </h1>
                    <p className="opacity-70 text-sm mt-1">
                        {counts.total} recipes
                    </p>
                </div>
                {/* Filter tabs */}
                <div className="relative inline-flex p-1 rounded-full border border-white/10 bg-white/5">
                    {(
                        [
                            { key: "all", label: `All (${counts.total})` },
                            {
                                key: "willCook",
                                label: `Will cook (${counts.willCook})`,
                            },
                            {
                                key: "cooked",
                                label: `Cooked (${counts.cooked})`,
                            },
                            { key: "liked", label: `Liked (${counts.liked})` },
                        ] as const
                    ).map((t) => {
                        const active = filter === t.key;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setFilter(t.key as any)}
                                className={`relative z-10 px-3 py-1.5 text-sm cursor-pointer rounded-full transition-colors ${
                                    active ? "text-black" : "hover:bg-white/10"
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="savedFilter"
                                        className="absolute inset-0 -z-10 rounded-full bg-[var(--color-primary)]"
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                {t.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {items.length === 0 ? (
                <div className="py-16 border border-white/10 rounded-[var(--radius)] bg-white/5 text-center">
                    <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-white/5">
                        <AnimatedFood />
                    </div>
                    <p className="opacity-80 mb-4">No saved recipes yet.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10"
                    >
                        Browse recipes
                    </Link>
                </div>
            ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence initial={false} mode="popLayout">
                        {visible.map((it) => (
                            <motion.li
                                key={it.recipe.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="rounded-[var(--radius)] border border-white/10 bg-white/5 overflow-hidden"
                            >
                                <div className="flex gap-4 p-3">
                                    <div className="shrink-0">
                                        <ImageWithFallback
                                            src={it.recipe.image}
                                            alt={it.recipe.title}
                                            className="w-20 h-20 rounded-[10px] border border-white/10 overflow-hidden bg-white/5"
                                            imgClassName="w-full h-full object-cover"
                                            fallback={
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <AnimatedFood />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            to={`/recipe/${it.recipe.id}`}
                                            className="font-semibold hover:text-[var(--color-primary)] line-clamp-2"
                                        >
                                            {it.recipe.title}
                                        </Link>
                                        {it.recipe.cuisine && (
                                            <div className="mt-1 flex flex-wrap gap-1.5">
                                                {it.recipe.cuisine.map((c) => (
                                                    <span
                                                        key={c}
                                                        className="px-2 py-0.5 text-xs rounded-full bg-white/10 border border-white/10"
                                                    >
                                                        {c}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex rounded-full border border-white/10 bg-white/5 overflow-hidden">
                                                <button
                                                    onClick={() =>
                                                        setStatus(
                                                            it.recipe.id,
                                                            "willCook"
                                                        )
                                                    }
                                                    className={`px-3 py-1.5 text-sm cursor-pointer ${
                                                        it.status === "willCook"
                                                            ? "bg-[var(--color-primary)] text-black"
                                                            : "hover:bg-white/10"
                                                    }`}
                                                >
                                                    Will cook
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setStatus(
                                                            it.recipe.id,
                                                            "cooked"
                                                        )
                                                    }
                                                    className={`px-3 py-1.5 text-sm cursor-pointer ${
                                                        it.status === "cooked"
                                                            ? "bg-[var(--color-primary)] text-black"
                                                            : "hover:bg-white/10"
                                                    }`}
                                                >
                                                    Cooked
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setStatus(
                                                            it.recipe.id,
                                                            "liked"
                                                        )
                                                    }
                                                    className={`px-3 py-1.5 text-sm cursor-pointer ${
                                                        it.status === "liked"
                                                            ? "bg-[var(--color-primary)] text-black"
                                                            : "hover:bg-white/10"
                                                    }`}
                                                >
                                                    Liked
                                                </button>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    remove(it.recipe.id)
                                                }
                                                className="px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    );
}
