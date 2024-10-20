import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { toast, ToastContainer } from 'react-toastify'; // Import Toast for notifications
import { FaEdit, FaTrash, FaSearch, FaWhatsapp } from 'react-icons/fa'; // Importing React icons
import 'react-toastify/dist/ReactToastify.css';

const TodaysAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [newDate, setNewDate] = useState('');

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


  // Get today's date in "15 October 2024" format
  const getTodayDate = () => {
    return format(new Date(), 'dd MMMM yyyy'); // Format to "15 October 2024"
  };

  const todayDate = getTodayDate();
  const todaysAppointments = appointments.filter((appointment) => {
    return format(new Date(appointment.date), 'dd MMMM yyyy') === todayDate; // Format to compare dates correctly
  }).filter(appointment => 
    appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) // Search functionality
  );

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = todaysAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const totalPages = Math.ceil(todaysAppointments.length / appointmentsPerPage);

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

  // Handle updating an appointment date
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
      fetchAppointments(); // Refresh appointments after updating
    } catch (error) {
      console.error('Error updating appointment date:', error);
      toast.error('Error updating appointment date');
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Today's Appointments</h1>

      {/* Search bar and Back button layout */}
      <div className="mb-4 flex justify-between items-center">
        {/* Back button on the left */}
        <Link to="/all-appointments">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Back
          </button>
        </Link>

        {/* Search bar on the right with increased width */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full max-w-xs pr-10"
          />
          <FaSearch className="absolute right-3 top-2 text-gray-500" />
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
              {currentAppointments.map((appointment, index) => (
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
                  <td className="py-2 px-4 flex space-x-2">
                    {editingAppointmentId === appointment._id ? (
                      <button
                        onClick={() => setEditingAppointmentId(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingAppointmentId(appointment._id)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          <FaEdit />
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
              disabled={currentPage === 1} // Disable if on the first page
              className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Previous
            </button>

            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages} // Disable if on the last page
              className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No appointments for today.</p>
      )}

      {/* Toastify Container for Notifications */}
      <ToastContainer />
    </div>
  );
};

export default TodaysAppointments;
