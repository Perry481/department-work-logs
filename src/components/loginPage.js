import React, { useState, useEffect } from "react";

const LoginPage = ({ onLoginSuccess, loginData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    // Find the user in the login data array based on username (EmployeeID) and password
    const user = loginData.find(
      (userData) =>
        userData.EmployeeID === username && userData.Password === password
    );

    // Check if user exists
    if (user) {
      // Call onLoginSuccess callback function to notify App component of successful login
      onLoginSuccess(user.DepartName, user.EmployeeID); // Pass DepartName to onLoginSuccess
      console.log(
        "Login successful. DepartName:",
        user.DepartName,
        "userID:",
        user.EmployeeID
      );
    } else {
      setError("帳號或密碼錯誤!");
    }
  };

  useEffect(() => {
    // console.log(loginData);
  }, []);

  return (
    <div
      className="login-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        marginTop: "10vh",
      }}
    >
      <div className="card-body login-card-body" style={{ maxWidth: "400px" }}>
        <h2 className="login-box-msg">工作日誌</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="帳號"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
            />
            <div className="input-group-append">
              <div className="input-group-text"></div>
            </div>
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="密碼"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
            <div className="input-group-append">
              <div className="input-group-text"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-8"></div>
            <div className="col-4">
              <button type="submit" className="btn btn-primary btn-block">
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
