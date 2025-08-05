import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo"><h1>CatchLog</h1></Link>

        {user && (
          <div className="navbar-links">
            <span className="navbar-user">Welcome, {user.email}</span>
            <Link to="/add" className="navbar-button new-trip-button">+ New Trip</Link>
            <button onClick={handleLogout} className="navbar-button logout-button">Logout</button>
          </div>
        )}

        {!user && (
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};



export default NavBar;

