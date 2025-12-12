import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Certificates from "../pages/Certificates";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/certificates"
          element={
            <PrivateRoute>
              <Certificates />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
