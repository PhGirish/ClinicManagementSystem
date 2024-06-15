import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [phone, setPhone] = useState("");
  const [checkup, setCheckup] = useState("");
  const [editId, setEditId] = useState(null); // State to handle edit functionality
  const [errors, setErrors] = useState({}); // State to handle validation errors

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

  const validatePhone = (phone) => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePhone(phone)) {
      newErrors.phone = "Phone number must be 10 digits long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if the patient already exists
    const q = query(collection(db, "patients"), where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      alert("Patient already exists");
      return;
    }

    // Add new patient
    const newPatient = {
      name,
      age,
      sex,
      phone,
      checkup,
    };

    try {
      const docRef = await addDoc(collection(db, "patients"), newPatient);
      newPatient.id = docRef.id;
      setPatients([...patients, newPatient]);
      setName("");
      setAge("");
      setSex("");
      setPhone("");
      setCheckup("");
      setErrors({}); // Clear errors after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEditPatient = async (e) => {
    e.preventDefault();
    if (!editId) return;

    const newErrors = {};

    if (!validatePhone(phone)) {
      newErrors.phone = "Phone number must be 10 digits long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const patientDoc = doc(db, "patients", editId);
    try {
      await updateDoc(patientDoc, { name, age, sex, phone, checkup });
      setPatients(
        patients.map((patient) =>
          patient.id === editId
            ? { ...patient, name, age, sex, phone, checkup }
            : patient
        )
      );
      setEditId(null);
      setName("");
      setAge("");
      setSex("");
      setPhone("");
      setCheckup("");
      setErrors({}); // Clear errors after successful submission
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeletePatient = async (id) => {
    console.log(`Deleting patient with ID: ${id}`);
    try {
      await deleteDoc(doc(db, "patients", String(id)));
      setPatients(patients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const startEdit = (patient) => {
    setEditId(patient.id);
    setName(patient.name);
    setAge(patient.age);
    setSex(patient.sex);
    setPhone(patient.phone);
    setCheckup(patient.checkup);
  };

  return (
    <div className="patients-container">
      <h2>Patient Registration</h2>
      <form
        onSubmit={editId ? handleEditPatient : handleAddPatient}
        className="patients-form"
      >
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <select value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
        <select
          value={checkup}
          onChange={(e) => setCheckup(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Checkup Type
          </option>
          <option value="General Checkup">General Checkup</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Cavity Filling">Cavity Filling</option>
          <option value="Root Canal">Root Canal</option>
          <option value="Orthodontics">Orthodontics</option>
        </select>
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>
      <h3 className="table-name">Patients List</h3>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.sex}</td>
              <td>{patient.phone}</td>
              <td>
                <button className="editbtn" onClick={() => startEdit(patient)}>
                  Edit
                </button>
                <button
                  className="editbtn"
                  onClick={() => handleDeletePatient(patient.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
