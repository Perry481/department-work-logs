import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";

const App = ({ Component, pageProps }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("Sales");

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  useEffect(() => {
    console.log(`setting the department: ${selectedDepartment}`);
  }, [selectedDepartment]); // Add selectedDepartment as a dependency

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>工作日誌</title>
      </Head>

      <Navbar />
      <SidebarMenu
        onDepartmentChange={handleDepartmentChange}
        selectedDepartment={selectedDepartment}
      />

      <div className="content-wrapper">
        <div className="container-fluid">
          <Component {...pageProps} selectedDepartment={selectedDepartment} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default App;
