// src/App.js
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./pages/PrivateRoutes.jsx";
import PrivateRoutes from "./pages/PublicRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <PrivateRoutes />
    </BrowserRouter>
  );
}

export default App;