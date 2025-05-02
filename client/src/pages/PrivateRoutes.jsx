import { Routes, Route } from "react-router-dom";
import Dashboard from "./PrivatePages/dashboard/dashboard.jsx";
import ExploreStocks from "./PrivatePages/exploreStocks/exploreStocks.jsx";
import Settings from "./PrivatePages/settings/settings.jsx";
import Portfolio from "./PrivatePages/portfolio/portfolio.jsx";

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/login" element={<Portfolio />} />
      <Route path="/admin/users" element={<ExploreStocks />} />
      <Route path="/admin/stocks" element={<Settings />} />
    </Routes>
  );
}