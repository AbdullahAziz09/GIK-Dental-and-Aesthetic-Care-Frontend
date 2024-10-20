import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import { FaEdit, FaTrash, FaWhatsapp } from 'react-icons/fa';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const appointmentsPerPage = 7;

 // Fetch appointments from the backend
const fetchAppointments = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/appointments');
    const data = await response.json();
    
    // Get current date and remove time portion
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight today

    // Filter out appointments that are before today
    const upcomingAppointments = data.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today; // Keep only appointments for today and future dates
    });

    setAppointments(upcomingAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
};

useEffect(() => {
  fetchAppointments();

  // Auto-refresh at midnight
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
  const timer = setTimeout(() => {
    fetchAppointments();
  }, msUntilMidnight);

  return () => clearTimeout(timer);
}, []);

  

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;

  // Filter appointments based on name and date
  const filteredAppointments = appointments
    .filter(appointment => {
      const isNameMatch = appointment.name.toLowerCase().includes(searchTerm.toLowerCase());
      const isDateMatch = searchDate ? format(new Date(appointment.date), 'yyyy-MM-dd') === searchDate : true;
      return isNameMatch && isDateMatch;
    })
    .sort((a, b) => appointments.indexOf(b) - appointments.indexOf(a)); // Sort by last entry first

  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Handle canceling an appointment
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      fetchAppointments(); // Refresh appointments after canceling
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  // Handle updating an appointment date
  const handleUpdateDate = async (appointmentId) => {
    if (!newDate) {
      alert('Please select a new date');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate }), // Update date
      });
      setEditingAppointmentId(null);
      setNewDate(''); // Reset date
      fetchAppointments(); // Refresh appointments after updating
    } catch (error) {
      console.error('Error updating appointment date:', error);
    }
  };

  // Pagination button handlers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Send WhatsApp message
  const handleSendMessage = (phone, name, date) => {
    const formattedMessage = `Hi ${name}, your appointment is on ${format(new Date(date), 'dd-MMMM-yyyy')}. Sorry for the inconvenience.`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Open WhatsApp and send message simultaneously
    const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;

    // Open WhatsApp without delay
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">All Appointments</h1>
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/todays-appointments">
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Today's Appointments
            </button>
          </Link>
          <Link to="/tomorrows-appointments">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Tomorrow's Appointments
            </button>
          </Link>
        </div>

        {/* Updated Search Inputs */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-xs mr-2"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-xs"
          />
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md mb-8">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Contact</th>
            <th className="py-2 px-4 text-left">Doctor</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Actions</th> {/* Action Header */}
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((appointment, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4 text-left">{appointment.name}</td>
              <td className="py-2 px-4 text-left">{appointment.contact}</td>
              <td className="py-2 px-4 text-left">{appointment.doctor}</td>
              <td className="py-2 px-4 text-left">
                {editingAppointmentId === appointment._id ? (
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="border rounded-lg px-2 py-1"
                  />
                ) : (
                  format(new Date(appointment.date), 'dd MMMM yyyy')
                )}
              </td>
              <td className="py-2 px-4 text-left flex items-center">
                {editingAppointmentId === appointment._id ? (
                  <button
                    onClick={() => handleUpdateDate(appointment._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded flex items-center"
                  >
                    Update
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingAppointmentId(appointment._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                    >
                      <FaEdit className="mr-1" />
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded flex items-center ml-2"
                    >
                      <FaTrash className="mr-1" />
                    </button>
                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleSendMessage(appointment.contact, appointment.name, appointment.date)}
                      className="bg-green-600 text-white px-2 py-1 rounded flex items-center ml-2"
                    >
                      <FaWhatsapp className="mr-1" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mb-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Previous
            </button>

            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Next
            </button>
          </div>
    </div>
  );
};

export default AllAppointments;
