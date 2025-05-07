// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Landing from "./pages/PublicPages/landing/landing.jsx"
import Login from "./pages/PublicPages/login/login.jsx";
import Signup from "./pages/PublicPages/signup/signup.jsx";

import Dashboard from "./pages/PrivatePages/dashboard/dashboard.jsx";
import ExploreStocks from "./pages/PrivatePages/exploreStocks/exploreStocks.jsx";
import Settings from "./pages/PrivatePages/settings/settings.jsx";
import Portfolio from "./pages/PrivatePages/portfolio/portfolio.jsx";

import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/admin/exploreStocks" element={<ProtectedRoute><ExploreStocks /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
