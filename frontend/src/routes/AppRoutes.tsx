import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

import Login           from "../pages/Login";
import Dashboard       from "../pages/Dashboard";
import Certificates    from "../pages/Certificates";
import Courses         from "../pages/Courses";
import CourseDetail    from "../pages/CourseDetail";
import LessonPlayer    from "../pages/LessonPlayer";
import InstructorPanel from "../pages/InstructorPanel";

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Login />;
  return <Navigate to={user?.role === "INSTRUCTOR" ? "/instructor" : "/dashboard"} replace />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RootRedirect />} />

        {/* Student routes */}
        <Route element={<PrivateRoute allowedRoles={["STUDENT", "ADMIN"]} />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/certificates" element={<Certificates />} />
        </Route>

        {/* Instructor routes */}
        <Route element={<PrivateRoute allowedRoles={["INSTRUCTOR", "ADMIN"]} />}>
          <Route path="/instructor" element={<InstructorPanel />} />
        </Route>

        {/* Shared authenticated routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/courses"          element={<Courses />} />
          <Route path="/courses/:id"      element={<CourseDetail />} />
          <Route path="/lessons/:id"      element={<LessonPlayer />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
