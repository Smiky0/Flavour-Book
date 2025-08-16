import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="recipe/:id" element={<RecipeDetail />} />
                <Route path="saved" element={<Saved />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
