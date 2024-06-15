import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import "./Appointment.css";

const Appointment = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [checkup, setCheckup] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const patientsCollection = collection(db, "patients");
        const patientsSnapshot = await getDocs(patientsCollection);
        const patientsList = patientsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPatients(patientsList);

        const appointmentsCollection = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsCollection,
          orderBy("timestamp", "desc")
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);
        const appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (!selectedPatientName || !checkup || !date) {
      alert("Please fill out all fields");
      return;
    }

    const newAppointment = {
      patientName: selectedPatientName,
      checkup,
      date,
      timestamp: serverTimestamp(),
    };

    try {
      if (editMode) {
        const docRef = doc(db, "appointments", currentAppointmentId);
        await updateDoc(docRef, newAppointment);
        setAppointments(
          appointments.map((appointment) =>
            appointment.id === currentAppointmentId
              ? { ...appointment, ...newAppointment }
              : appointment
          )
        );
        setEditMode(false);
        setCurrentAppointmentId(null);
      } else {
        const docRef = await addDoc(
          collection(db, "appointments"),
          newAppointment
        );
        newAppointment.id = docRef.id;
        setAppointments([newAppointment, ...appointments]);
      }

      setSelectedPatientName("");
      setCheckup("");
      setDate("");
    } catch (error) {
      console.error("Error adding appointment: ", error);
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedPatientName(appointment.patientName);
    setCheckup(appointment.checkup);
    setDate(appointment.date);
    setEditMode(true);
    setCurrentAppointmentId(appointment.id);
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      await deleteDoc(doc(db, "appointments", appointmentId));
      setAppointments(
        appointments.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (error) {
      console.error("Error deleting appointment: ", error);
    }
  };

  return (
    <div className="appointment-container">
      <h2>Schedule Appointment</h2>
      <form onSubmit={handleAddAppointment} className="appointment-form">
        <select
          value={selectedPatientName}
          onChange={(e) => setSelectedPatientName(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Patient
          </option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.name}>
              {patient.name}
            </option>
          ))}
        </select>
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
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">{editMode ? "Update" : "Add"} Appointment</button>
      </form>
      <h3 className="table-name">Appointments List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Checkup Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.checkup}</td>
                <td>{appointment.date}</td>
                <td>
                  <button
                    className="editbtn"
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    Edit
                  </button>
                  <button
                    className="editbtn"
                    onClick={() => handleDeleteAppointment(appointment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointment;
