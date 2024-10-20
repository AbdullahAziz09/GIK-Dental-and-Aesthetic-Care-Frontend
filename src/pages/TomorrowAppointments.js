import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaTrash, FaWhatsapp, FaSearch } from 'react-icons/fa'; // Importing React Icons
import 'react-toastify/dist/ReactToastify.css';

const TomorrowAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const appointmentsPerPage = 10;

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getTomorrowDate = () => {
    const tomorrow = addDays(new Date(), 1);
    return format(tomorrow, 'dd MMMM yyyy');
  };

  const tomorrowDate = getTomorrowDate();
  const tomorrowAppointments = appointments.filter((appointment) => {
    return format(new Date(appointment.date), 'dd MMMM yyyy') === tomorrowDate;
  });

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = tomorrowAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(tomorrowAppointments.length / appointmentsPerPage);

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

  const handleUpdateDate = async (appointmentId) => {
    if (!newDate) {
      toast.error('Please select a new date');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate }),
      });
      toast.success('Appointment date updated successfully');
      setEditingAppointmentId(null);
      setNewDate('');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment date:', error);
      toast.error('Error updating appointment date');
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  const handleSendMessage = (phone, name, date) => {
    const formattedMessage = `Hi ${name}, your appointment is on ${format(new Date(date), 'dd-MMMM-yyyy')}. Sorry for the inconvenience.`;
    const encodedMessage = encodeURIComponent(formattedMessage);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const whatsappUrl = `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tomorrow's Appointments</h1>

      {/* Navigation and Search Bar */}
      <div className="flex justify-between items-center mb-4">
        <Link to="/all-appointments">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
            Back
          </button>
        </Link>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg pl-4 pr-10 py-2 w-full max-w-xs"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {currentAppointments.length > 0 ? (
        <>
          <table className="min-w-full bg-white rounded-lg shadow-md mb-8">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Contact</th>
                <th className="py-2 px-4 text-left">Doctor</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments
                .filter(appointment =>
                  appointment.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((appointment, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2 px-4">{appointment.name}</td>
                    <td className="py-2 px-4">{appointment.contact}</td>
                    <td className="py-2 px-4">{appointment.doctor}</td>
                    <td className="py-2 px-4">
                      {editingAppointmentId === appointment._id ? (
                        <>
                          <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="border rounded-lg px-2 py-1"
                          />
                          <button
                            onClick={() => handleUpdateDate(appointment._id)}
                            className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                          >
                            Update
                          </button>
                        </>
                      ) : (
                        format(new Date(appointment.date), 'dd MMMM yyyy')
                      )}
                    </td>
                    <td className="py-2 px-4 flex items-center space-x-2">
                      {editingAppointmentId === appointment._id ? (
                        <button
                          onClick={() => setEditingAppointmentId(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancel
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
                            className="bg-red-500 text-white px-2 py-1 rounded flex items-center"
                          >
                            <FaTrash className="mr-1" />
                          </button>
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
        </>
      ) : (
        <p>No appointments for tomorrow.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default TomorrowAppointments;
