import React, { useEffect, useState } from 'react';

const Home = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0); // New state for remaining amount

  // Fetch patient count and amounts
  const fetchDashboardData = async () => {
    try {
      // Fetch patient count
      const patientCountResponse = await fetch('http://localhost:5000/api/patients/dashboard/patient-count', {
        headers: {
          'Cache-Control': 'no-cache', // Prevent caching
        },
      });
      if (!patientCountResponse.ok) {
        throw new Error('Failed to fetch patient count');
      }
      const patientCountData = await patientCountResponse.json();
      setPatientCount(patientCountData.count);

      // Fetch total and paid amounts
      const amountsResponse = await fetch('http://localhost:5000/api/patients/dashboard/amounts', {
        headers: {
          'Cache-Control': 'no-cache', // Prevent caching
        },
      });
      if (!amountsResponse.ok) {
        throw new Error('Failed to fetch amounts');
      }
      const amountsData = await amountsResponse.json();
      setTotalAmount(amountsData.totalAmount);
      setPaidAmount(amountsData.paidAmount);
      setRemainingAmount(amountsData.totalAmount - amountsData.paidAmount); // Calculate remaining amount
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6 text-center">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Patient Count Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2">Total Patients</h2>
          <p className="text-4xl font-bold text-blue-600">{patientCount}</p>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2">Total Amount</h2>
          <p className="text-4xl font-bold text-blue-600">{totalAmount} PKR</p>
        </div>

        {/* Paid Amount Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold mb-2">Paid Amount</h2>
          <p className="text-4xl font-bold text-green-600">{paidAmount} PKR</p>
        </div>
      </div>

      {/* Horizontal Bar Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold mb-2">Comparison</h2>
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <span>Total Amount: </span>
            <div className="w-full bg-gray-200 h-4 mx-2 ml-11">
              <div
                className="bg-blue-600 h-full"
                style={{ width: `${(totalAmount / (totalAmount || 1)) * 100}%` }}
              ></div>
            </div>
            <span>{totalAmount} PKR</span>
          </div>
          <div className="flex items-center mb-2">
            <span>Paid Amount: </span>
            <div className="w-full bg-gray-200 h-4 mx-2 ml-11">
              <div
                className="bg-green-600 h-full"
                style={{ width: `${(paidAmount / (totalAmount || 1)) * 100}%` }}
              ></div>
            </div>
            <span>{paidAmount} PKR</span>
          </div>
          <div className="flex items-center mb-2">
            <span>Remaining Amount: </span>
            <div className="w-full bg-gray-200 h-4 mx-2 ">
              <div
                className="bg-red-600 h-full"
                style={{ width: `${(remainingAmount / (totalAmount || 1)) * 100}%` }}
              ></div>
            </div>
            <span>{remainingAmount} PKR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
