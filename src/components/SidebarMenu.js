import React, { forwardRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const SidebarMenu = forwardRef((props, ref) => {
  const router = useRouter();

  const isLinkActive = (href) => {
    return router.pathname === href;
  };

  return (
    <div ref={ref}>
      <aside
        style={{ height: "100vh", position: "fixed" }}
        className="main-sidebar sidebar-dark-primary elevation-4"
      >
        {/* Brand Logo */}
        <a href="/" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
          />
          <span className="brand-text font-weight-light">工作日誌</span>
          <button
            style={{
              backgroundColor: "#343A40",
              color: "#D6D8D9",
              marginLeft: "20px",
            }}
            className="btn btn-secondary btn-sm "
            data-widget="pushmenu"
          >
            關閉選單
          </button>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/EBC/userIconBlue.jpg
                "
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                User
              </a>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
     with font-awesome or any other icon font library */}
              <li className="nav-item">
                <Link href="/mixedAnalyze">
                  <div
                    className={`nav-link ${isLinkActive("/") ? "active" : ""}`}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>業務處</p>
                  </div>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/yearlyAnalysis">
                  <div
                    className={`nav-link ${
                      isLinkActive("/yearlyAnalysis") ? "active" : ""
                    }`}
                  >
                    <i className="far fa-circle nav-icon" />
                    <p>工程處</p>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
});
export default SidebarMenu;
