import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-link" style={{ fontSize: "20px", fontWeight: "bold" }}>
        EduTrack
      </Link>

      <div className="nav-links">
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
        <Link className="nav-link" to="/certificates">Meus certificados</Link>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {user && (
          <button onClick={logout} className="theme-toggle" style={{ background: "#ef4444" }}>
            Sair
          </button>
        )}
      </div>
    </nav>
  );
}
