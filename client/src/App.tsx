import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTask";
import { Workspaces } from "./pages/workspace";   
import  MainLayout from "./components/layout/MainLayout"
import { LayoutProvider } from "./context/layout/LayoutProvider";
import "./index.css";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <MainLayout>
                <Dashboard />
                </MainLayout>
              </LayoutProvider>
              
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <MainLayout>
                <MyTasks />
                </MainLayout>
              </LayoutProvider>
              
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <LayoutProvider>
                <MainLayout>
                <Workspaces />
                </MainLayout>
              </LayoutProvider>
              
            </ProtectedRoute>
          }
        />
      </Routes>
  );
}

export default App;
