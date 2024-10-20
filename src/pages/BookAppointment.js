import React, { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';

const BookAppointment = () => {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  const [networkCode, setNetworkCode] = useState('');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const [doctor, setDoctor] = useState('Dr. Khan');
  const [date, setDate] = useState('');

  const subscriberNumberRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (networkCode.length !== 3) {
      return toast.error('Network code must be exactly 3 digits.');
    }
    if (subscriberNumber.length !== 7) {
      return toast.error('Subscriber number must be exactly 7 digits.');
    }

    const formattedContact = `${countryCode} ${networkCode.trim()} ${subscriberNumber.trim()}`;
    const formattedDate = format(new Date(date), 'dd MMMM yyyy');
    const appointmentData = { name, contact: formattedContact, doctor, date: formattedDate };

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        toast.success('Appointment booked successfully!');
        setName('');
        setCountryCode('+92');
        setNetworkCode('');
        setSubscriberNumber('');
        setDate('');
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleNetworkCodeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^[0-9]*$/.test(value)) {
      setNetworkCode(value);
      if (value.length === 3) {
        subscriberNumberRef.current.focus();
      }
    }
  };

  const handleSubscriberNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 7 && /^[0-9]*$/.test(value)) {
      setSubscriberNumber(value);
      if (value.length === 7) {
        document.getElementById('submit-button').focus();
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mx-auto mt-5 ml-56 border border-gray-300">
      <h1 className="text-3xl font-bold text-center mb-6">Book Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            type="text"
            placeholder="Patient Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="block w-1/4 p-3 border border-gray-300 rounded-lg text-center bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Network Code"
              value={networkCode}
              onChange={handleNetworkCodeChange}
              className="block w-1/4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Subscriber Number "
              value={subscriberNumber}
              onChange={handleSubscriberNumberChange}
              ref={subscriberNumberRef}
              className="block w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Doctor</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Dr. Khan">Dr. Khan</option>
            <option value="Dr. Fatima">Dr. Fatima</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            id="submit-button"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
          >
            Book Appointment
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BookAppointment;
