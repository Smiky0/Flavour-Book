// Simple API wrapper using TheMealDB (free, no key) as default.
// Alternative: Edamam Recipe Search (requires key) or Spoonacular (paid limits).
// We'll use TheMealDB for demo quality and worldwide cuisines.

import type { RecipeDetail, RecipeSummary } from "../types";
import { cachedFetchJson } from "./cache";

const MEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

// TheMealDB models "meals" with fields like idMeal, strMeal, strMealThumb, strArea (cuisine), ingredients in numbered fields.

type Meal = {
    idMeal: string;
    strMeal: string;
    strArea: string | null;
    strCategory: string | null;
    strMealThumb: string | null;
    strInstructions: string | null;
    strSource: string | null;
    strYoutube: string | null;
    [key: string]: string | null;
};

type MealsResponse = { meals: Meal[] | null };

function mapMealToSummary(m: Meal): RecipeSummary {
    const cuisine = m.strArea ? [m.strArea] : undefined;
    return {
        id: m.idMeal,
        title: m.strMeal,
        image: m.strMealThumb ?? undefined,
        cuisine,
    };
}

function extractIngredients(m: Meal) {
    const list: { name: string; amount?: number; unit?: string }[] = [];
    for (let i = 1; i <= 20; i++) {
        const ing = m[`strIngredient${i}`];
        const meas = m[`strMeasure${i}`];
        if (ing && ing.trim()) {
            // Parse amount + unit from measure if possible, else keep as unit only
            const parts = (meas || "").trim();
            let amount: number | undefined;
            let unit: string | undefined;
            if (parts) {
                // naive parse: split first token if numeric/fraction
                const tokens = parts.split(/\s+/);
                const first = tokens[0];
                const fracMatch = first?.match(/^(\d+)(?:\/(\d+))?$/);
                const num = Number(first);
                if (!Number.isNaN(num)) {
                    amount = num;
                    unit = tokens.slice(1).join(" ");
                } else if (fracMatch) {
                    const a = Number(fracMatch[1]);
                    const b = Number(fracMatch[2] || "1");
                    amount = a / b;
                    unit = tokens.slice(1).join(" ");
                } else {
                    unit = parts;
                }
            }
            list.push({ name: ing.trim(), amount, unit });
        }
    }
    return list;
}

export async function searchRecipes(query: string): Promise<RecipeSummary[]> {
    const url = `${MEALDB_BASE}/search.php?s=${encodeURIComponent(query)}`;
    const data = await cachedFetchJson<MealsResponse>(url, 5 * 60 * 1000);
    if (!data.meals) return [];
    return data.meals.map(mapMealToSummary);
}

export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
    const url = `${MEALDB_BASE}/lookup.php?i=${encodeURIComponent(id)}`;
    const data = await cachedFetchJson<MealsResponse>(url, 24 * 60 * 60 * 1000);
    const meal = data.meals?.[0];
    if (!meal) return null;
    const ingredients = extractIngredients(meal);
    const summary = mapMealToSummary(meal);
    return {
        ...summary,
        ingredients,
        instructionsText: meal.strInstructions ?? undefined,
        sourceUrl: meal.strSource ?? undefined,
        youtubeQuery: meal.strYoutube ? undefined : `${meal.strMeal} recipe`,
    };
}

export async function listByCuisine(area: string): Promise<RecipeSummary[]> {
    const url = `${MEALDB_BASE}/filter.php?a=${encodeURIComponent(area)}`;
    const data = await cachedFetchJson<MealsResponse>(url, 24 * 60 * 60 * 1000);
    if (!data.meals) return [];
    // filter endpoint returns limited fields; map accordingly
    return data.meals.map((m) => ({
        id: m.idMeal,
        title: m.strMeal,
        image: m.strMealThumb ?? undefined,
        cuisine: m.strArea ? [m.strArea] : undefined,
    }));
}
