import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import "./DoctorAppointment.css";

const DoctorAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
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
        console.error("Error fetching appointments: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="doc-appointment-container">
      <h3 className="doc-appointment-heading">Appointments List</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="doc-appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Checkup Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.checkup}</td>
                <td>{appointment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorAppointment;
