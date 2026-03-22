import React, { useEffect, useState } from 'react';
import { dummyStudentEnrolled } from '../../assets/assets'; // [1]
import Loading from '../../components/student/Loading';

const StudentsEnrolled = () => {
  // 1. Initialize State for Enrolled Students [2]
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  // 2. Fetch dummy data instead of the backend [2]
  const fetchEnrolledStudents = () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };

  // 3. Load the data when the component mounts [2]
  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  // 4. Loading State & Main UI render [3]
  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">

        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">

          {/* Table Headers [3] */}
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>

          {/* Table Body mapping through dummy enrolled students [4] */}
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20">

                {/* Dynamic Row Numbering [4] */}
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {index + 1}
                </td>

                {/* Student Image and Name [4] */}
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt="student profile"
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{item.student.name}</span>
                </td>

                {/* Course Title [4] */}
                <td className="px-4 py-3 truncate">
                  {item.courseTitle}
                </td>

                {/* Enrollment Date [4] */}
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  ) : (
    <Loading /> /* Fallback to loading screen if data is null [3] */
  );
};

export default StudentsEnrolled;