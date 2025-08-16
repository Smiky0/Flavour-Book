## Recipebook — Modern React Recipe Finder

Search recipes from around the world, view beautiful details, select ingredients to shop, watch related videos, and save dishes you will cook, cooked, or liked.

### Features
- Global recipe search using TheMealDB (no API key required)
- Modern detail page: hero image with fallback, cuisine chips, YouTube search link, clear step-by-step instructions
- Ingredients with checkboxes + “Order selected on Amazon” redirect
- Saved collection with smooth filters and status controls (Will cook / Cooked / Liked)
- Animated, responsive UI with a consistent theme and accessible focus states
- Client-side caching with TTL for fast repeat loads

### Tech Stack
- Vite + React 19 + TypeScript
- React Router (routing)
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Framer Motion (micro-interactions)
- TheMealDB (public recipe data)

### Getting Started
Prerequisites: Node.js 18+ and npm.

Development
- Install: `npm install`
- Start dev server: `npm run dev`
- Open the URL printed in the terminal (Vite default is http://localhost:5173)

Production Build
- Build: `npm run build`
- Preview: `npm run preview`

### Project Structure
```
src/
  App.tsx              # Routes (Home, RecipeDetail, Saved)
  main.tsx             # App bootstrap
  index.css            # Global styles, font, tokens
  components/
    Layout.tsx         # Header/nav + animated tab highlight
    SearchBar.tsx      # Search input with responsive button
    RecipeCard.tsx     # Result card
    ImageWithFallback.tsx  # Image loader with SVG fallback
    AnimatedFood.tsx       # Minimal SVG placeholder
  pages/
    Home.tsx           # Search + results grid
    RecipeDetail.tsx   # Details, ingredients, actions
    Saved.tsx          # Saved list with filters and statuses
  services/
    api.ts             # TheMealDB wrappers (search, get by id, by cuisine)
    cache.ts           # TTL cache with stale fallback
    storage.ts         # Saved items in localStorage
  types.ts             # Shared types
```

### Configuration
- No API keys required. The app calls TheMealDB endpoints directly from the browser.
- Amazon and YouTube links are plain redirects built from the recipe or query.

### Performance & SEO
- Local font is preloaded; TheMealDB/YouTube/Amazon are preconnected.
- Cached fetch with an 8s timeout and stale-fallback for resilience.
- Respect `prefers-reduced-motion`; enhanced `:focus-visible` ring.
- Basic SEO meta tags (title, description, canonical, Open Graph/Twitter) in `index.html`.

### Accessibility
- Keyboard-friendly navigation with visible focus outlines.
- Reduced motion support.

### Data Attribution
This project uses the free TheMealDB API (https://www.themealdb.com) for recipe data and images.
