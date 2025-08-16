// Basic types for recipes from Spoonacular-like APIs
export type RecipeSummary = {
    id: string;
    title: string;
    image?: string;
    cuisine?: string[];
};

export type Ingredient = {
    id?: string | number;
    name: string;
    amount?: number;
    unit?: string;
};

export type RecipeDetail = RecipeSummary & {
    ingredients: Ingredient[];
    instructionsText?: string; // plain text fallback
    instructionsHtml?: string; // rich HTML if available
    sourceUrl?: string;
    youtubeQuery?: string; // query to search on YouTube
};

export type SavedStatus = "willCook" | "cooked" | "liked";

export type SavedEntry = {
    recipe: RecipeSummary;
    status: SavedStatus;
    savedAt: number;
};
