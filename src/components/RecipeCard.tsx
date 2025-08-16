import { Link } from "react-router-dom";
import type { RecipeSummary } from "../types";

type Props = { recipe: RecipeSummary };

export default function RecipeCard({ recipe }: Props) {
    return (
        <Link
            to={`/recipe/${recipe.id}`}
            className="group block rounded-xl overflow-hidden bg-transparent backdrop-blur-sm outline-2 outline-white/15 hover:outline-[var(--color-primary)] transition-all duration-400 ease-in-out"
        >
            {recipe.image && (
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="font-semibold text-lg group-hover:text-[var(--color-primary)]">
                    {recipe.title}
                </h3>
                {recipe.cuisine && (
                    <p className="text-md opacity-70 mt-1">
                        {recipe.cuisine.join(", ")}
                    </p>
                )}
            </div>
        </Link>
    );
}
