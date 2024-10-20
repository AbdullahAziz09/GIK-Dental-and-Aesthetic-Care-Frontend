import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import BookAppointment from './pages/BookAppointment';
import AddPatient from './pages/AddPatient';
import AllPatients from './pages/AllPatients';
import AllAppointments from './pages/AllAppointments';
import PatientProfile from './pages/PatientProfile';
import TomorrowAppointments from './pages/TomorrowAppointments';
import TodaysAppointments from './pages/TodaysAppointments';

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  // Function to add a new appointment
  const addAppointment = (appointment) => setAppointments([...appointments, appointment]);

  // Function to add a new patient
  const addPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
  };

  // Function to update a patient's details
  const updatePatient = (id, updatedPatient) => {
    const updatedPatients = patients.map((patient, index) =>
      index === parseInt(id) ? updatedPatient : patient
    );
    setPatients(updatedPatients);
  };

  // Function to delete a patient
  const deletePatient = (id) => {
    const updatedPatients = patients.filter((_, index) => index !== parseInt(id));
    setPatients(updatedPatients);
  };

  // Function to cancel an appointment
  const cancelAppointment = (appointmentToCancel) => {
    const updatedAppointments = appointments.filter(
      (appointment) => appointment !== appointmentToCancel
    );
    setAppointments(updatedAppointments);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-appointment" element={<BookAppointment onAddAppointment={addAppointment} />} />
            
            {/* Updated Patient Routes */}
            <Route path="/add-patient" element={<AddPatient onAddPatient={addPatient} />} />
            <Route path="/all-patients" element={<AllPatients patients={patients} />} />
            <Route path="/patient/:id" element={<PatientProfile patients={patients} onUpdatePatient={updatePatient} onDeletePatient={deletePatient} />} />
           

            <Route path="/all-appointments" element={<AllAppointments appointments={appointments} onCancelAppointment={cancelAppointment} />} />
            <Route path="/tomorrows-appointments" element={<TomorrowAppointments />} />
            <Route path="/todays-appointments" element={<TodaysAppointments />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
