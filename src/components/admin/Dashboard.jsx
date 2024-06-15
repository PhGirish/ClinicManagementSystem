import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const patientsSnapshot = await getDocs(collection(db, "patients"));
        const patientsList = patientsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPatientsData(patientsList);

        const appointmentsSnapshot = await getDocs(
          collection(db, "appointments")
        );
        const appointmentsList = appointmentsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAppointmentsData(appointmentsList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const getAppointmentsByDate = () => {
    const dates = {};
    appointmentsData.forEach((appointment) => {
      const date = appointment.date;
      dates[date] = (dates[date] || 0) + 1;
    });
    return dates;
  };

  const getCheckupTypes = () => {
    const checkupTypes = {};
    patientsData.forEach((patient) => {
      const type = patient.checkup;
      checkupTypes[type] = (checkupTypes[type] || 0) + 1;
    });
    return checkupTypes;
  };

  const appointmentsByDate = getAppointmentsByDate();
  const checkupTypes = getCheckupTypes();

  const appointmentsChartData = {
    labels: Object.keys(appointmentsByDate),
    datasets: [
      {
        label: "Appointments",
        data: Object.values(appointmentsByDate),
        fill: false,
        backgroundColor: "#a2d2ff",
        borderColor: "#8ecae6",
      },
    ],
  };

  const checkupTypesChartData = {
    labels: Object.keys(checkupTypes),
    datasets: [
      {
        label: "Checkup Types",
        data: Object.values(checkupTypes),
        backgroundColor: "#d4edda",
        borderColor: "#28a745",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Admin Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-dashboard-charts">
          <div className="admin-dashboard-chart">
            <h2>Appointments Over Time</h2>
            <Line data={appointmentsChartData} />
          </div>
          <div className="admin-dashboard-chart">
            <h2>Checkup Types</h2>
            <Bar data={checkupTypesChartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
