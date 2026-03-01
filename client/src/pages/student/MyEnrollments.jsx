import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Footer from '../../components/student/Footer';
import { Line } from 'rc-progress';

const MyEnrollments = () => {
    // 1. Get global variables and functions from context (No API functions yet)
    const { 
        enrolledCourses, 
        calculateCourseDuration, 
        navigate 
    } = useContext(AppContext);

    // 2. Dummy State for tracking the progress of all enrolled courses
    // This is later replaced by an Axios API call to the backend
    const [progressArray, setProgressArray] = useState([
        { lectureCompleted: 2, totalLectures: 4 },
        { lectureCompleted: 1, totalLectures: 5 },
        { lectureCompleted: 3, totalLectures: 6 },
        { lectureCompleted: 4, totalLectures: 4 },
        { lectureCompleted: 0, totalLectures: 3 },
        { lectureCompleted: 5, totalLectures: 7 }
    ]);

    return (
        <>
            <div className="px-8 md:px-40 pt-14">
                <h1 className="text-2xl font-semibold">My Enrollments</h1>

                <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
                    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
                        <tr>
                            <th className="px-4 py-3 font-semibold truncate">Course</th>
                            <th className="px-4 py-3 font-semibold truncate">Duration</th>
                            <th className="px-4 py-3 font-semibold truncate">Completed</th>
                            <th className="px-4 py-3 font-semibold truncate cursor-pointer">Status</th>
                        </tr>
                    </thead>
                    
                    <tbody className="text-gray-700">
                        {enrolledCourses.map((course, index) => (
                            <tr key={index} className="border-b border-gray-500/20">
                                
                                {/* Course Thumbnail & Progress Bar */}
                                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                                    <img 
                                        src={course.courseThumbnail} 
                                        alt="course thumbnail" 
                                        className="w-14 sm:w-24 md:w-28" 
                                    />
                                    <div className="flex-1">
                                        <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                                        {/* Progress Bar mapped to percentage calculation from dummy array */}
                                        <Line 
                                            strokeWidth={2} 
                                            percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0} 
                                            className="bg-gray-300 rounded-full" 
                                        />
                                    </div>
                                </td>
                                
                                {/* Course Duration */}
                                <td className="px-4 py-3 max-sm:hidden">
                                    {calculateCourseDuration(course)}
                                </td>
                                
                                {/* Completed Lectures Counter */}
                                <td className="px-4 py-3 max-sm:hidden">
                                    {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`} <span>Lectures</span>
                                </td>
                                
                                {/* Enroll / Play Status Button */}
                                <td className="px-4 py-3 max-sm:text-right">
                                    <button 
                                        onClick={() => navigate('/player/' + course._id)}
                                        className="px-3 py-1.5 sm:px-5 sm:py-2 bg-blue-600 text-white text-sm rounded cursor-pointer"
                                    >
                                        {/* Conditional logic displaying whether all lectures are marked complete */}
                                        {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

export default MyEnrollments;
 