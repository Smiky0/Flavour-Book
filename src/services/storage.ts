import type { RecipeSummary, SavedEntry, SavedStatus } from "../types";

const KEY = "recipebook:saved";

function read(): Record<string, SavedEntry> {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return {};
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function write(map: Record<string, SavedEntry>) {
    localStorage.setItem(KEY, JSON.stringify(map));
}

export function upsertSaved(recipe: RecipeSummary, status: SavedStatus) {
    const map = read();
    map[recipe.id] = { recipe, status, savedAt: Date.now() };
    write(map);
    return map[recipe.id];
}

export function removeSaved(id: string) {
    const map = read();
    delete map[id];
    write(map);
}

export function getSaved(id: string): SavedEntry | undefined {
    const map = read();
    return map[id];
}

export function listSaved(): SavedEntry[] {
    const map = read();
    return Object.values(map).sort((a, b) => b.savedAt - a.savedAt);
}
