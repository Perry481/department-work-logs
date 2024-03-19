// components/Header.js
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = ({ onButtonClick }) => {
  const router = useRouter();
  const isLinkActive = (href) => {
    return router.pathname === href;
  };
  const handleButtonClick = () => {
    onButtonClick(); // Call the provided callback
  };
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="pushmenu"
            href="#"
            role="button"
            onClick={handleButtonClick}
          >
            <i className="fas fa-bars" />
          </a>
        </li>
        {/* <li className="nav-item d-none d-sm-inline-block">
          <Link
            href="/"
            className={`nav-link ${isLinkActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
        </li> */}
      </ul>
      {/* Right navbar links */}
    </nav>
  );
};

export default Navbar;
