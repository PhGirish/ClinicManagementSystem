import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import "./Login.css";
import { toast } from "react-toastify";

const Login = () => {
  const [isDoctor, setIsDoctor] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Use useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("successfully logged in", { position: "top-center" });
      if (isDoctor) {
        navigate("/doctor");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="login-container">
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${isDoctor ? "active" : ""}`}
          onClick={() => setIsDoctor(true)}
        >
          Doctor
        </button>
        <button
          className={`toggle-button ${!isDoctor ? "active" : ""}`}
          onClick={() => setIsDoctor(false)}
        >
          Admin
        </button>
      </div>
      <div className={`form-container ${isDoctor ? "doctor" : "admin"}`}>
        <div className={`form ${isDoctor ? "doctor-form" : "admin-form"}`}>
          <h2 className="login-head">
            {isDoctor ? "Doctor Login" : "Admin Login"}
          </h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder={`${isDoctor ? "Doctor's" : "Admin's"} Email`}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button> <br />
            <Link to="/register">Don't have an account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
