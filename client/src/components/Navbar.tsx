// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import LoginProps from "../interfaces/LoginProps";

const Navbar = (props: LoginProps) => {
  const navigate = useNavigate();

  return (
    <div className="nav">
      <div className="nav-title">
        <Link to="/">
          <h3>Krazy Kanban Board</h3>
        </Link>
      </div>
      <ul>
        {!props.loggedIn ? (
          <li className="nav-item">
            <button type="button">
              <Link to="/login">Login</Link>
            </button>
          </li>
        ) : (
          <>
            <li className="nav-item">
              <button type="button" id="create-ticket-link">
                <Link to="/create">New Ticket</Link>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                onClick={() => {
                  auth.logout();
                  props.setLoggedIn(false);
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
