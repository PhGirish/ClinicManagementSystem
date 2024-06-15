import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./DoctorPage.css";
import DoctorViewPatient from "./DoctorViewPatient";
import DoctorAppointment from "./DoctorAppointment"; // New import

const DoctorPage = () => {
  return (
    <div className="doctor-app-container">
      <aside className="doctor-sidebar">
        <div className="doctor-profile">
          <div className="doc-img-container">
            <img
              className="doctor-img"
              src="/doctor.jpg"
              alt="Doctor Profile Picture"
            />
          </div>

          <span className="doctor-role">Doctor</span>
        </div>
        <nav>
          <ul>
            <li>
              <Link className="doc-a" to="doctorViewPatient">
                Patients
              </Link>
            </li>
            <li>
              <Link className="doc-a" to="doctorAppointment">
                Appointment
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="doctor-main-content">
        <header>
          <h1 className="doctor-heading">DOCTOR PORTAL</h1>
          <button className="doctor-logout">Logout</button>
        </header>
        <div className="doctor-content">
          <Routes>
            <Route path="doctorViewPatient" element={<DoctorViewPatient />} />
            <Route path="doctorAppointment" element={<DoctorAppointment />} />
            <Route path="*" element={<DoctorViewPatient />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default DoctorPage;
