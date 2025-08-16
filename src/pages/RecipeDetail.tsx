import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecipeById } from "../services/api";
import type {
    Ingredient,
    RecipeDetail as RDetail,
    SavedStatus,
} from "../types";
import { getSaved, removeSaved, upsertSaved } from "../services/storage";
import ImageWithFallback from "../components/ImageWithFallback";
import AnimatedFood from "../components/AnimatedFood";

export default function RecipeDetail() {
    const { id = "" } = useParams();
    const [recipe, setRecipe] = useState<RDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<SavedStatus | undefined>(undefined);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const r = await getRecipeById(id);
                setRecipe(r);
                const saved = getSaved(id);
                setStatus(saved?.status);
                const sel: Record<string, boolean> = {};
                r?.ingredients.forEach((ing) => {
                    sel[ing.name] = true;
                });
                setSelected(sel);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const selectedList = useMemo(
        () =>
            Object.entries(selected)
                .filter(([, v]) => v)
                .map(([k]) => k),
        [selected]
    );
    const selectedCount = selectedList.length;

    function toggleSel(name: string) {
        setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
    }
    function selectAll() {
        if (!recipe) return;
        const all: Record<string, boolean> = {};
        recipe.ingredients.forEach((i) => (all[i.name] = true));
        setSelected(all);
    }
    function clearAll() {
        setSelected({});
    }

    function amazonFreshUrl(items: string[]) {
        const query = encodeURIComponent(items.join(", "));
        return `https://www.amazon.com/s?k=${query}&i=grocery`;
    }
    function youtubeUrl(q: string) {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(
            q
        )}`;
    }
    function save(st: SavedStatus) {
        if (!recipe) return;
        upsertSaved(
            {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                cuisine: recipe.cuisine,
            },
            st
        );
        setStatus(st);
    }
    function unsave() {
        removeSaved(id);
        setStatus(undefined);
    }

    if (loading) return <div className="opacity-80 text-lg">Loading…</div>;
    if (!recipe) return <p>Recipe not found.</p>;

    return (
        <div className="space-y-10">
            {/* Header Card */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid md:grid-cols-2 gap-6 p-4 md:p-6 rounded-2xl border border-white/10 bg-white/5 shadow-xl"
            >
                <ImageWithFallback
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-56 h-56 md:w-[30rem] md:h-56 mx-auto md:mx-0 rounded-2xl border border-white/10 overflow-hidden bg-white/5"
                    imgClassName="w-full h-full object-cover"
                    fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <AnimatedFood />
                        </div>
                    }
                />

                <div className="flex-1 items-center justify-center backdrop-blur-lg p-4 bg-black/10 rounded-2xl">
                    <h1 className="text-2xl md:text-3xl font-semibold">
                        {recipe.title}
                    </h1>
                    {recipe.cuisine && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {recipe.cuisine.map((c) => (
                                <span
                                    key={c}
                                    className="px-2.5 py-1 rounded-full text-sm bg-white/10 border border-white/10"
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Save states */}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <div className="inline-flex rounded-full border border-white/10 bg-white/5 overflow-hidden">
                            <button
                                onClick={() => save("willCook")}
                                className={`px-3 py-2 text-sm md:text-base cursor-pointer ${
                                    status === "willCook"
                                        ? "bg-[var(--color-primary)] text-black"
                                        : "hover:bg-white/10"
                                }`}
                            >
                                🍳 Will cook
                            </button>
                            <button
                                onClick={() => save("cooked")}
                                className={`px-3 py-2 text-sm md:text-base cursor-pointer ${
                                    status === "cooked"
                                        ? "bg-[var(--color-primary)] text-black"
                                        : "hover:bg-white/10"
                                }`}
                            >
                                ✅ Cooked
                            </button>
                            <button
                                onClick={() => save("liked")}
                                className={`px-3 py-2 text-sm md:text-base cursor-pointer ${
                                    status === "liked"
                                        ? "bg-[var(--color-primary)] text-black"
                                        : "hover:bg-white/10"
                                }`}
                            >
                                ❤️ Liked
                            </button>
                        </div>
                        {status && (
                            <button
                                onClick={unsave}
                                className="cursor-pointer px-3 py-2 rounded-full border border-white/10 hover:bg-red-600/40 duration-300 transition-all ease-in-out"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {recipe.sourceUrl && (
                            <a
                                href={recipe.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
                            >
                                <span>📖 Source</span>
                            </a>
                        )}
                        <a
                            href={youtubeUrl(
                                recipe.youtubeQuery || `${recipe.title} recipe`
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] !text-black hover:opacity-90"
                        >
                            ▶ Watch video
                        </a>
                    </div>
                </div>
            </motion.section>

            {/* Instructions */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="text-xl md:text-2xl font-semibold mb-3">
                    Instructions
                </h2>
                <span className="text-white/60">
                    NOTE: If instructions are unclear or missing, please click
                    the "Watch video" button for a detailed video instruction
                </span>
                {recipe.instructionsText ? (
                    <ol className="space-y-3 md:space-y-4 list-decimal pl-6 md:pl-7 leading-7 opacity-95">
                        {recipe.instructionsText
                            .split(/\r?\n/)
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .map((line, i) => (
                                <li key={i}>{line}</li>
                            ))}
                    </ol>
                ) : (
                    <p className="opacity-70">No instructions available.</p>
                )}
            </motion.section>
            {/* Ingredients */}
            <motion.section
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="flex items-end justify-between gap-3 mb-3">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Ingredients
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={selectAll}
                            className="cursor-pointer px-3 py-1.5 rounded-full border text-white hover:text-[var(--color-primary)] border-white/10 hover:bg-white/10 duration-300 transition-all ease-in-out"
                        >
                            Select all
                        </button>
                        <button
                            onClick={clearAll}
                            className="cursor-pointer px-3 py-1.5 rounded-full hover:text-red-500 text-white border border-white/10 duration-300 transition-all ease-in-out"
                        >
                            Unselect all
                        </button>
                    </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {recipe.ingredients.map((ing: Ingredient) => (
                        <li
                            key={ing.name}
                            className="flex items-center gap-3 px-3 py-3 rounded-[12px] border border-white/10 bg-white/5"
                        >
                            <input
                                type="checkbox"
                                className="size-5 cursor-pointer accent-white/60"
                                checked={!!selected[ing.name]}
                                onChange={() => toggleSel(ing.name)}
                            />
                            <span className="leading-6">
                                <span className="font-medium">{ing.name}</span>
                                <span className="opacity-80">
                                    {ing.amount ? ` — ${ing.amount}` : ""}
                                    {ing.unit ? ` ${ing.unit}` : ""}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                    <span className="opacity-80 text-sm">
                        Selected: {selectedCount}/{recipe.ingredients.length}
                    </span>
                    <a
                        href={amazonFreshUrl(selectedList)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/80 !text-black font-semibold hover:opacity-90"
                    >
                        🛒 Order items on Amazon
                    </a>
                </div>
            </motion.section>

            <div className="pt-2">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10"
                >
                    ← Back to search
                </Link>
            </div>
        </div>
    );
}
