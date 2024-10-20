import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPatient = () => {
  const [name, setName] = useState('');
  const [doctorName, setDoctorName] = useState('Doctor 1');
  const [countryCode, setCountryCode] = useState('+92');
  const [networkCode, setNetworkCode] = useState('');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');

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
    const patient = { name, doctorName, contactNumber: formattedContact, totalAmount, paidAmount, age, gender };

    try {
      const response = await fetch('http://localhost:5000/api/patients/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (response.ok) {
        toast.success('Patient added successfully!');
        setName('');
        setDoctorName('Doctor 1');
        setCountryCode('+92');
        setNetworkCode('');
        setSubscriberNumber('');
        setTotalAmount('');
        setPaidAmount('');
        setAge('');
        setGender('Male');
      } else {
        toast.error('Error adding patient. Please try again.');
      }
    } catch (error) {
      toast.error('Error adding patient. Please check your connection.');
      console.error(error);
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
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto mt-0 border border-gray-300 fixed top-4 left-0 right-0">
      <h1 className="text-3xl font-bold text-center mb-6">Add Patient</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Patient Name</label>
            <input
              type="text"
              placeholder="Patient Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Doctor Name</label>
            <select
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Doctor 1">Doctor 1</option>
              <option value="Doctor 2">Doctor 2</option>
              <option value="Doctor 3">Doctor 3</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Contact Number</label>
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
              placeholder="Network Code "
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
          <label className="block text-gray-700 font-semibold mb-1">Total Amount</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Paid Amount</label>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
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
            Add Patient
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddPatient;
