import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
  // 1. Get global variables from Context (No backend functions needed yet)
  const { currency } = useContext(AppContext);

  // 2. Initialize State for Dashboard Data
  const [dashboardData, setDashboardData] = useState(null); // [1]

  // 3. Fetch dummy data from assets instead of the backend
  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData); // [2]
  };

  // 4. Fetch data when component loads
  useEffect(() => {
    fetchDashboardData(); // [2]
  }, []);

  // 5. Loading State
  if (!dashboardData) {
    return <Loading />; // [2]
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">

        {/* --- TOP METRICS ROW --- */}
        <div className="flex flex-wrap gap-5 items-center">

          {/* Total Enrollments */}
          <div className="flex items-center gap-3 shadow-custom-card border border-gray-500/20 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="patients_icon" /> {/* [3] */}
            <div>
              <p className="text-2xl font-medium text-gray-600">{dashboardData.enrolledStudentsData.length}</p> {/* [3] */}
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>

          {/* Total Courses */}
          <div className="flex items-center gap-3 shadow-custom-card border border-gray-500/20 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="appointments_icon" /> {/* [3] */}
            <div>
              <p className="text-2xl font-medium text-gray-600">{dashboardData.totalCourses}</p> {/* [3] */}
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="flex items-center gap-3 shadow-custom-card border border-gray-500/20 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="earning_icon" /> {/* [3] */}
            <div>
              <p className="text-2xl font-medium text-gray-600">{currency}{dashboardData.totalEarnings}</p> {/* [3] */}
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* --- LATEST ENROLLMENTS TABLE --- */}
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th> {/* [4] */}
                  <th className="px-4 py-3 font-semibold">Student Name</th> {/* [4] */}
                  <th className="px-4 py-3 font-semibold">Course Title</th> {/* [4] */}
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {/* Map through dummy enrolled students array */}
                {dashboardData.enrolledStudentsData.map((item, index) => ( // [5]
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td> {/* [5] */}
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      {/* Accessing student image and name from dummy data */}
                      <img src={item.student.imageUrl} alt="Profile" className="w-9 h-9 rounded-full" /> {/* [5] */}
                      <span className="truncate">{item.student.name}</span> {/* [5] */}
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td> {/* [5] */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;