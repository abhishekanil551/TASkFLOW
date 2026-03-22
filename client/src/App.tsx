import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import "./index.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {" "}
              <Home />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
