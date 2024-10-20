// src/pages/AllPatients.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 7;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">All Patients</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-xs"
          />
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Contact</th>
            <th className="py-2 px-4 text-left">Doctor Name</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient) => (
            <tr key={patient._id} className="border-t">
              <td className="py-2 px-4 text-left">{patient.name}</td>
              <td className="py-2 px-4 text-left">{patient.contactNumber}</td>
              <td className="py-2 px-4 text-left">{patient.doctorName}</td>
              <td className="py-2 px-4 text-left">
                <Link to={`/patient/${patient._id}`} className="bg-blue-500 text-white px-2 py-1 rounded">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
          {currentPatients.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
        >
          Previous
        </button>

        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => (currentPatients.length < patientsPerPage ? prev : prev + 1))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllPatients;
