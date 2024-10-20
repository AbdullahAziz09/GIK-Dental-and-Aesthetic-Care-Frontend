import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-500 to-purple-600 text-white flex flex-col shadow-lg">
      <div className="flex items-center justify-center h-24 bg-gray-800">
        <h1 className="text-2xl font-bold text-center">GIK Dental and Aesthetic Care</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li>
            <Link to="/" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
              Home
            </Link>
          </li>
          <li>
            <Link to="/book-appointment" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
              Book Appointment
            </Link>
          </li>
          <li>
            <Link to="/add-patient" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
              Add Patient
            </Link>
          </li>
          <li>
            <Link to="/all-patients" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
              All Patients
            </Link>
          </li>
          <li>
            <Link to="/all-appointments" className="block p-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out">
              All Appointments
            </Link>
          </li>
        </ul>
      </nav>
      <footer className="mt-auto p-4 text-center bg-gray-800">
        <p className="text-sm">&copy; {new Date().getFullYear()} GIK Dental and Aesthetic Care. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Sidebar;
