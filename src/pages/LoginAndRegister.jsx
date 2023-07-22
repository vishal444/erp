import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function LoginAndRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // handle login or registration logic here
    if (isLogin) {
      try {
        // Send login request to the API using Axios
        axios
          .post("http://bisbuddy.xyz:8080/api/erp/auth/authenticate", {
            email,
            password,
          })
          .then((response) => {
            if (response.status === 200) {
              // If login is successful, save the token to local storage
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("email", email);
              setRedirectUrl("/tabs");
            } else {
              setErrorMessage("Login failed. Please check your credentials.");
            }
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage("Login failed. Please try again later.");
          });
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    } else {
      try {
        // Send registration request to the API using Axios
        axios
          .post("http://bisbuddy.xyz:8080/api/erp/auth/register", {
            email,
            password,
          })
          .then((response) => {
            if (response.status === 200) {
              // If registration is successful, save the token to local storage
              localStorage.setItem("token", response.data.token);
              localStorage.setItem("email", email);
              setRedirectUrl("/massInput");
            } else {
              setErrorMessage("Registration failed. Please try again later.");
            }
          })
          .catch((error) => {
            console.log(error);
            setErrorMessage("Registration failed. Please try again later.");
          });
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  // Redirect logic
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }

  return (
    <div className="listing-container-ash-notwide">
      <form onSubmit={handleSubmit} style={{ paddingTop: "50px" }}>
        <div className="listing-container">
          <h1>{isLogin ? "Login" : "Register"}</h1>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <br />
          <button type="submit" className="button">
            {isLogin ? "Login" : "Register"}
          </button>
          <br />
        </div>
      </form>
      <label>{isLogin ? "Dont have an account" : "Already have an account"}</label>
      <button onClick={handleToggle} className="button">
        {isLogin ? "Register" : "Login"}
      </button>
      {errorMessage && <p>{errorMessage}</p>}
      <Link to="/forgot-password">Forgot password?</Link>
    </div>
  );
}

export default LoginAndRegister;
