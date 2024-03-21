import React, { forwardRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const SidebarMenu = ({ onDepartmentChange, selectedDepartment }) => {
  const handleClick = (department) => {
    console.log(`switching to :${department}`);
    onDepartmentChange(department);
  };

  return (
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
            <li className="nav-item">
              <div
                className={`nav-link ${
                  selectedDepartment === "Sales" ? "active" : ""
                }`}
                onClick={() => handleClick("Sales")}
              >
                <i className="far fa-circle nav-icon" />
                <p>業務處</p>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${
                  selectedDepartment === "Industry" ? "active" : ""
                }`}
                onClick={() => handleClick("Industry")}
              >
                <i className="far fa-circle nav-icon" />
                <p>工程處</p>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${
                  selectedDepartment === "Materials" ? "active" : ""
                }`}
                onClick={() => handleClick("Materials")}
              >
                <i className="far fa-circle nav-icon" />
                <p>資材部</p>
              </div>
            </li>
            <li className="nav-item">
              <div
                className={`nav-link ${
                  selectedDepartment === "QualityAssurance" ? "active" : ""
                }`}
                onClick={() => handleClick("QualityAssurance")}
              >
                <i className="far fa-circle nav-icon" />
                <p>品保部</p>
              </div>
            </li>
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
    </aside>
  );
};
export default SidebarMenu;
