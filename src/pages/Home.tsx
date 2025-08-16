import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes } from "../services/api";
import type { RecipeSummary } from "../types";

export default function Home() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<RecipeSummary[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // initial popular search example
        (async () => {
            setLoading(true);
            try {
                const data = await searchRecipes("chicken");
                setResults(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleSearch(q: string) {
        setQuery(q);
        setLoading(true);
        try {
            const data = await searchRecipes(q || "");
            setResults(data);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Find your next dish</h1>
            <SearchBar onSearch={handleSearch} initial={query} />
            {loading && <p className="opacity-70">Searching…</p>}
            {!loading && results.length === 0 && (
                <p className="opacity-70">
                    No recipes found. Try another keyword.
                </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                ))}
            </div>
        </div>
    );
}
