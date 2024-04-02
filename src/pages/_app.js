import React, { useState, useEffect } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import SidebarMenu from "../components/SidebarMenu";
import Footer from "../components/Footer";
import LoginPage from "../components/loginPage";
const App = ({ Component, pageProps }) => {
  const [loginApiData, setLoginApiData] = useState(null);
  const [departName, setDepartName] = useState("");
  const [userID, setUserID] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };
  const fetchLoginDataFromAPI = async () => {
    try {
      // Make a GET request to your API endpoint with the departmentName as a query parameter
      const response = await fetch(`/api/loginApi`);

      // Check if the request was successful (status code 200)
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      // Parse the JSON response
      const data = await response.json();

      // Set the fetched data in state
      setLoginApiData(data);
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLoginDataFromAPI();
  }, []);

  useEffect(() => {
    console.log(`setting the department: ${selectedDepartment}`);
  }, [selectedDepartment]); // Add selectedDepartment as a dependency
  const handleLoginSuccess = (departName, userID) => {
    setIsLoggedIn(true); // Update isLoggedIn state to true upon successful login
    console.log(departName);
    setDepartName(departName);
    setSelectedDepartment(departName);
    setUserID(userID);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>工作日誌</title>
      </Head>
      {/* Render LoginPage component if user is not logged in */}
      {!isLoggedIn && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          loginData={loginApiData}
        />
      )}
      {isLoggedIn && (
        <>
          <Navbar />
          <SidebarMenu
            onDepartmentChange={handleDepartmentChange}
            selectedDepartment={selectedDepartment}
            departName={departName}
            userID={userID}
          />

          <div className="content-wrapper">
            <div className="container-fluid">
              <Component
                {...pageProps}
                selectedDepartment={selectedDepartment}
                departName={departName}
                userID={userID}
              />
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default App;
