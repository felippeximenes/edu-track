// frontend/src/components/Navbar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">
          Edu<span>Track</span>
        </span>

        {user && (
          <nav className="navbar-links">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/certificates"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Meus certificados
            </NavLink>
          </nav>
        )}
      </div>

      {user && (
        <div className="navbar-right">
          <span className="navbar-user">Olá, {user.name}</span>
          <button className="navbar-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
