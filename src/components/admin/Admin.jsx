import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./Admin.css";
import Dashboard from "./Dashboard";

import Patients from "./Patients";
import Appointment from "./Appointment";
import Billing from "./Billing";

const Admin = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="profile">
          <div className="img-container">
            <img className="adminimg" src="/admin1.jpg" alt="" />
          </div>

          <span className="role">Admin</span>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="dashboard">Dashboard</Link>
            </li>

            <li>
              <Link to="patients">Patients</Link>
            </li>
            <li>
              <Link to="appointment">Appointment</Link>
            </li>
            <li>
              <Link to="billing">Billing</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header>
          <h1>ADMIN</h1>
          <button className="logout">Logout</button>
        </header>
        <div className="content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />

            <Route path="patients" element={<Patients />} />
            <Route path="appointment" element={<Appointment />} />
            <Route path="billing" element={<Billing />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
