import { Routes, Route } from "react-router-dom";
import Landing from "./PublicPages/landing/landing.jsx";
import Login from "./PublicPages/login/login.jsx";
import Signup from "./PublicPages/signup/signup.jsx";
import StartSim from "./PublicPages/startSim/startSim.jsx";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}