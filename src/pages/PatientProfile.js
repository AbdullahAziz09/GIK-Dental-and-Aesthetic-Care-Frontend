// src/pages/PatientProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [visitAmount, setVisitAmount] = useState('');
  const [updateFields, setUpdateFields] = useState({
    name: '',
    contactNumber: '',
    doctorName: 'Doctor 1', // Default doctor name
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${id}`);
        const data = await response.json();
        setPatient(data);
        // Initialize update fields
        setUpdateFields({
          name: data.name,
          contactNumber: data.contactNumber,
          doctorName: data.doctorName,
        });
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    fetchPatient();
  }, [id]);

  const handleAddVisit = async (e) => {
    e.preventDefault();
    const visit = { date: new Date(), amount: parseFloat(visitAmount) }; // Current date and user-defined amount
  
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}/visits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(visit),
      });
  
      if (response.ok) {
        toast.success('Visit added successfully');
        setVisitAmount(''); // Resetting visitAmount
        // Re-fetch patient data to update visits
        const updatedResponse = await fetch(`http://localhost:5000/api/patients/${id}`);
        const updatedData = await updatedResponse.json();
        setPatient(updatedData);
      } else {
        toast.error('Error adding visit');
      }
    } catch (error) {
      console.error('Error adding visit:', error);
      toast.error('Error adding visit');
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateFields),
      });

      if (response.ok) {
        toast.success('Patient updated successfully');
        setIsEditing(false);
        const updatedResponse = await fetch(`http://localhost:5000/api/patients/${id}`);
        const updatedData = await updatedResponse.json();
        setPatient(updatedData);
      } else {
        toast.error('Error updating patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      toast.error('Error updating patient');
    }
  };

  const handleDeletePatient = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Patient deleted successfully');
          // Redirect to another page or reset the state
          window.location.href = '/all-patients'; // Adjust the path according to your routing
        } else {
          toast.error('Error deleting patient');
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Error deleting patient');
      }
    }
  };

  const handlePrintInvoice = () => {
    const invoiceWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
  
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f5f5f5;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .invoice-container {
              background-color: #fff;
              padding: 20px;
              width: 595px; /* A4 width in px */
              margin: 50px auto;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              border-top: 6px solid #333; /* Black border */
              position: relative;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #eee;
            }
            .invoice-header h1 {
              font-size: 28px;
              color: #333; /* Black */
              margin: 0;
            }
            .invoice-header p {
              font-size: 13px;
              color: #666; /* Grey */
              margin: 3px 0;
            }
            h2 {
              font-size: 20px;
              color: #333; /* Black */
              text-align: center;
              margin-top: 20px;
              margin-bottom: 10px;
              letter-spacing: 0.5px;
            }
            .invoice-details {
              margin: 15px 0;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              background-color: #fafafa;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
            }
            .invoice-details p {
              margin: 0;
              font-size: 15px;
              color: #333; /* Black */
            }
            .invoice-details p strong {
              color: #000;
            }
            .status {
              color: white;
              background-color: ${patient.totalAmount - patient.paidAmount === 0 ? '#28a745' : '#dc3545'}; /* Green for paid, red for unpaid */
              padding: 8px;
              border-radius: 20px;
              display: inline-block;
              font-weight: bold;
              font-size: 12px;
              text-transform: uppercase;
              text-align: center;
              margin-top: 5px;
            }
            table {
              width: 100%;
              margin-top: 15px;
              border-collapse: collapse;
              font-size: 15px;
            }
            th, td {
              padding: 10px;
              border-bottom: 1px solid #ddd;
              text-align: center;
            }
            th {
              background-color: #f4f4f4;
              font-weight: bold;
              color: #666; /* Grey */
            }
            td.amount {
              font-size: 16px;
              font-weight: bold;
              color: #333; /* Black */
            }
            .total-row td {
              font-weight: bold;
              border-top: 2px solid #333; /* Black */
              border-bottom: none;
            }
            .invoice-footer {
              text-align: center;
              font-size: 12px;
              color: #888; /* Light Grey */
              margin-top: 25px;
            }
            .invoice-footer p {
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>GIK Dental and Aesthetic Care</h1>
              <p>Excellence in Dental & Aesthetic Care</p>
              <p>Contact: +92 123 456789 | 123 Main Street, City</p>
              <p>Date: ${currentDate} | Time: ${currentTime}</p>
            </div>
  
            <h2>Patient Invoice</h2>
  
            <div class="invoice-details">
              <p><strong>Patient Name:</strong> ${patient.name}</p>
              <p><strong>Gender:</strong> ${patient.gender}</p>
              <p><strong>Contact Number:</strong> ${patient.contactNumber}</p>
              <p><strong>Age:</strong> ${patient.age}</p>
              <p><strong>Doctor:</strong> ${patient.doctorName}</p>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consultation/Service Fee</td>
                  <td class="amount">${patient.totalAmount}</td>
                </tr>
                <tr>
                  <td>Amount Paid</td>
                  <td class="amount">${patient.paidAmount}</td>
                </tr>
                <tr>
                  <td>Total Due</td>
                  <td class="amount">${patient.totalAmount - patient.paidAmount}</td>
                </tr>
                <tr class="total-row">
                  <td><strong>Status</strong></td>
                  <td><span class="status">${patient.totalAmount - patient.paidAmount === 0 ? 'Paid' : 'Unpaid'}</span></td>
                </tr>
              </tbody>
            </table>
  
            <div class="invoice-footer">
              <p>Thank you for choosing GIK Dental and Aesthetic Care.</p>
              <p>This is a computer-generated invoice. No signature required.</p>
            </div>
          </div>
        </body>
      </html>
    `);
  
    invoiceWindow.document.close();
    invoiceWindow.print();
  };
  

  if (!patient) {
    return <div>Loading...</div>;
  }

  const remainingAmount = patient.totalAmount - patient.paidAmount;
  const isPaid = remainingAmount === 0;

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options).replace(',', ''); // Adjusting to remove comma for cleaner format
  };

  return (
    <div className="container mx-auto mt-8">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Patient Profile</h1>
      <div className="grid grid-cols-2 gap-6">
  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-2xl font-semibold mb-4 text-center">Patient Details</h2>
    {isEditing ? (
      <form onSubmit={handleUpdatePatient}>
        <input
          type="text"
          value={updateFields.name}
          onChange={(e) => setUpdateFields({ ...updateFields, name: e.target.value })}
          className="border border-gray-300 p-3 rounded mb-4 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          value={updateFields.contactNumber}
          onChange={(e) => setUpdateFields({ ...updateFields, contactNumber: e.target.value })}
          className="border border-gray-300 p-3 rounded mb-4 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <select
          value={updateFields.doctorName}
          onChange={(e) => setUpdateFields({ ...updateFields, doctorName: e.target.value })}
          className="border border-gray-300 p-3 rounded mb-4 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Doctor 1</option>
          <option>Doctor 2</option>
          <option>Doctor 3</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Update</button>
      </form>
    ) : (
      <div className="flex flex-col">
        <p className="text-lg font-medium mb-2"><strong>Name:</strong> {patient.name}</p>
        <p className="text-lg font-medium mb-2"><strong>Contact:</strong> {patient.contactNumber}</p>
        <p className="text-lg font-medium mb-2"><strong>Doctor:</strong> {patient.doctorName}</p>
        <p className="text-lg font-medium mb-2"><strong>Age:</strong> {patient.age}</p>
        <p className="text-lg font-medium mb-2"><strong>Gender:</strong> {patient.gender}</p>
        <p className="text-lg font-medium mb-2"><strong>Total Amount:</strong> {patient.totalAmount.toFixed(0)}</p>
        <p className="text-lg font-medium mb-2"><strong>Paid Amount:</strong> {patient.paidAmount.toFixed(0)}</p>
        <p className={`text-lg font-semibold mb-2 ${isPaid ? 'text-green-500' : 'text-red-500'}`}>
          <strong>{isPaid ? 'Status' : 'Remaining Amount'}:</strong> {isPaid ? 'Paid' : `${remainingAmount.toFixed(0)}`}
        </p>
      </div>
    )}
  </div>

  <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 className="text-2xl font-semibold mb-4 text-center">Add Visit</h2>
    <form onSubmit={handleAddVisit} className="mb-4">
      <input
        type="number"
        placeholder="Visit Amount"
        value={visitAmount}
        onChange={(e) => setVisitAmount(e.target.value)}
        className="border border-gray-300 p-3 rounded mb-4 w-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        disabled={isPaid} // Disable if already paid
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200" disabled={isPaid}>
        Add Visit
      </button>
    </form>
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {/* Initial visit as the first entry */}
        <tr>
          <td className="border px-4 py-2">{formatDate(patient.createdAt)}</td>
          <td className="border px-4 py-2">{patient.paidAmount.toFixed(0)}</td>
        </tr>
        {patient.visits.length === 0 ? (
          <tr>
            <td className="border px-4 py-2" colSpan="2">No additional visits found</td>
          </tr>
        ) : (
          patient.visits.map((visit, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{formatDate(visit.date)}</td>
              <td className="border px-4 py-2">{visit.amount.toFixed(0)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>


      <div className="mt-4 flex justify-start space-x-2"> {/* Flex container for button alignment */}
        <button onClick={handlePrintInvoice} className="bg-green-500 text-white py-2 px-4 rounded">Print Invoice</button>
        <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white py-2 px-4 rounded">Edit Patient</button>
        <button onClick={handleDeletePatient} className="bg-red-500 text-white py-2 px-4 rounded">Delete Patient</button>
      </div>
    </div>
  );
};

export default PatientProfile;
