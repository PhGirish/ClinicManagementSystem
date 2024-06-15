import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./DoctorViewPatient.css";

const DoctorViewPatient = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const patientsCollection = collection(db, "patients");
      const patientsSnapshot = await getDocs(patientsCollection);
      const patientsList = patientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPatients(patientsList);
    };

    fetchPatients();
  }, []);

  return (
    <div className="doc-patients-container">
      <h3 className="doch3">Patients List</h3>
      <table className="doc-patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Phone Number</th>
            <th>Checkup Type</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={index}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.phone}</td>
              <td>{patient.checkup}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorViewPatient;
