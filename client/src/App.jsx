// src/App.js
import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "./pages/PrivateRoutes.jsx";
import PrivateRoutes from "./pages/PublicRoutes.jsx";
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <PublicRoutes />
      <PrivateRoutes />
    </BrowserRouter>
  );
}

export default App;