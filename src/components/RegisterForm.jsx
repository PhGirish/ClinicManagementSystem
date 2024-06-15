import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import "./Register.css";

const Register = () => {
  const [isDoctor, setIsDoctor] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    adjustHeight();
  }, [isDoctor]);

  const adjustHeight = () => {
    const formContainer = document.querySelector(".reg-form-container");
    const activeForm = formContainer.querySelector(
      isDoctor ? ".doctor-reg-form" : ".admin-reg-form"
    );
    formContainer.style.height = `${activeForm.offsetHeight + 40}px`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        role: isDoctor ? "doctor" : "admin",
      });
      toast.success("Registered successfully", { position: "top-center" });
      navigate("/login");
    } catch (error) {
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="register-container">
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
      <div className={`reg-form-container ${isDoctor ? "doctor" : "admin"}`}>
        <div
          className={`reg-form ${
            isDoctor ? "doctor-reg-form" : "admin-reg-form"
          }`}
        >
          <h2 className="register-head">
            {isDoctor ? "Doctor Register" : "Admin Register"}
          </h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
              type="text"
              name="username"
              placeholder="User Name"
              onChange={handleChange}
              required
            />
            {errors.username && (
              <span className="error">{errors.username}</span>
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />
            {errors.mobileNumber && (
              <span className="error">{errors.mobileNumber}</span>
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
            <button className="reg-button" type="submit">
              Register
            </button>
            <br />
            <Link to="/login">Return to Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
