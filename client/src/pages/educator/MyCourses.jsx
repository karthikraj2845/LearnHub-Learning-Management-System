import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';

const MyCourses = () => {
  // 1. Get currency and dummy allCourses data from context
  const { currency, allCourses } = useContext(AppContext);

  // 2. Initialize State for Courses
  const [courses, setCourses] = useState(null);

  // 3. Fetch courses directly from the context instead of the backend
  const fetchEducatorCourses = () => {
    setCourses(allCourses);
  };

  // 4. Load the courses when the component mounts
  useEffect(() => {
    fetchEducatorCourses();
  }, []);

  // 5. Loading State & Main UI render
  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">

            {/* Table Headers */}
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
              </tr>
            </thead>

            {/* Table Body mapping through dummy courses */}
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">

                  {/* Course Thumbnail & Title */}
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <img src={course.courseThumbnail} alt="Course Thumbnail" className="w-16" />
                    <span className="truncate hidden md:block">{course.courseTitle}</span>
                  </td>

                  {/* Earnings Calculation (Price * Number of Students) */}
                  <td className="px-4 py-3">
                    {currency}{Math.floor(course.coursePrice * course.enrolledStudents.length)}
                  </td>

                  {/* Enrolled Students Count */}
                  <td className="px-4 py-3">
                    {course.enrolledStudents.length}
                  </td>

                  {/* Publish Date */}
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
