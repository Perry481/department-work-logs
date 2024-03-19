import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";

const App = ({ Component, pageProps }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleButtonClick = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle the state
  };

  const handleContentWrapperClick = () => {
    const body = document.body;
    const isOpen = body.classList.contains("sidebar-open");

    if (isOpen) {
      // Replace "sidebar-open" with "sidebar-closed" and remove "sidebar-collapse"
      body.className = "sidebar-mini layout-fixed sidebar-closed";
      setIsSidebarOpen(false); // Set the state to closed
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>工作日誌</title>
      </Head>

      {/* <Navbar /> */}
      <Navbar onButtonClick={handleButtonClick} />

      <SidebarMenu />

      <div className="content-wrapper">
        <div className="container-fluid">
          <Component {...pageProps} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
