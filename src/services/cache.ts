const PREFIX = "recipebook:cache:v1:";

type CacheEntry<T = unknown> = {
    t: number; // timestamp ms
    v: T; // value
    ttl: number; // ttl ms
};

function k(url: string) {
    return `${PREFIX}${url}`;
}

function now() {
    return Date.now();
}

export function getCache<T = unknown>(url: string): CacheEntry<T> | null {
    try {
        const raw = localStorage.getItem(k(url));
        if (!raw) return null;
        return JSON.parse(raw) as CacheEntry<T>;
    } catch {
        return null;
    }
}

export function setCache<T = unknown>(url: string, value: T, ttl: number) {
    const entry: CacheEntry<T> = { t: now(), v: value, ttl };
    try {
        localStorage.setItem(k(url), JSON.stringify(entry));
    } catch {
        // ignore quota errors
    }
}

export function isFresh(entry: CacheEntry | null) {
    if (!entry) return false;
    return now() - entry.t < entry.ttl;
}

export async function cachedFetchJson<T = unknown>(
    url: string,
    ttl: number,
    init?: RequestInit
): Promise<T> {
    const entry = getCache<T>(url);
    if (isFresh(entry)) {
        return entry!.v as T;
    }
    try {
        const res = await fetch(url, init);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as T;
        setCache(url, json, ttl);
        return json;
    } catch (err) {
        // fallback to stale cache if available
        if (entry) return entry.v as T;
        throw err;
    }
}
