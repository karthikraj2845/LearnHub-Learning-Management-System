import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import Footer from '../../components/student/Footer';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';

const CourseDetails = () => {
    // 1. Get the course ID from the URL parameters
    const { id } = useParams(); // [1]
    
    // 2. Fetch dummy courses array and calculator functions from Context
    const { 
        allCourses, // [1]
        currency, 
        calculateRating, 
        calculateChapterTime, 
        calculateCourseDuration, 
        calculateNoOfLectures 
    } = useContext(AppContext);

    // 3. Initial State Variables
    const [courseData, setCourseData] = useState(null); // [1]
    const [openSections, setOpenSections] = useState({}); // [5]
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false); // [4]
    const [playerData, setPlayerData] = useState(null); // [6]

    // 4. Initial Fetch Logic (Finding course from dummy array instead of API)
    const fetchCourseData = async () => {
        const findCourse = allCourses.find(course => course._id === id); // [2]
        setCourseData(findCourse); // [2]
    };

    useEffect(() => {
        fetchCourseData(); // [7]
    }, [allCourses]); // [8]

    // 5. Toggle Chapter Accordion
    const toggleSection = (index) => {
        setOpenSections((prev) => ({
            ...prev,
            [index]: !prev[index]
        })); // [5, 9]
    };

    // 6. Loading State
    if (!courseData) {
        return <Loading />; // [10]
    }

    return (
        <>
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-section-height -z-10 bg-linear-to-b from-cyan-100/70"></div> {/* [11] */}

            {/* Main Layout: Left & Right Columns */}
            <div className="flex flex-col-reverse md:flex-row gap-10 relative items-start justify-between px-8 md:px-40 pt-20 text-left"> {/* [7] */}
                
                {/* --- LEFT COLUMN --- */}
                <div className="max-w-xl z-10 text-gray-500"> {/* [12] */}
                    
                    {/* Course Title */}
                    <h1 className="text-course-details-heading-small md:text-course-details-heading-large font-semibold text-gray-800">
                        {courseData.courseTitle} {/* [13] */}
                    </h1>

                    {/* Short Description */}
                    <p 
                        className="pt-4 text-sm md:text-base" 
                        dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}  
                    /> {/* [14, 15] */}

                    {/* Ratings & Reviews */}
                    <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
                        <p>{calculateRating(courseData)}</p>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <img 
                                    key={i} 
                                    src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} 
                                    alt="star" 
                                    className="w-3.5 h-3.5"
                                />
                            ))}
                        </div>
                        <p className="text-gray-500">
                            ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'}) {/* [16] */}
                        </p>
                        <p className="text-blue-600">
                            {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'} {/* [3] */}
                        </p>
                    </div>

                    {/* Hardcoded Educator Name (Before API dynamic fetching) */}
                    <p className="text-sm">
                        Course by <span className="text-blue-600 underline">LearnHub</span> {/* [3] */}
                    </p>

                    {/* Course Structure (Chapters & Lectures) */}
                    <div className="pt-8 text-gray-800">
                        <h2 className="text-xl font-semibold">Course Structure</h2> {/* [17] */}
                        <div className="pt-5">
                            {courseData.courseContent.map((chapter, index) => (
                                <div key={index} className="border border-gray-300 bg-white mb-2 rounded"> {/* [18] */}
                                    {/* Chapter Header */}
                                    <div 
                                        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none" 
                                        onClick={() => toggleSection(index)} // [9]
                                    >
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={assets.down_arrow_icon} 
                                                alt="Arrow icon" 
                                                className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} // [19, 20]
                                            />
                                            <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p> {/* [21] */}
                                        </div>
                                        <p className="text-sm md:text-default text-gray-500">
                                            {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)} {/* [18, 21] */}
                                        </p>
                                    </div>
                                    
                                    {/* Lectures List (Collapsible) */}
                                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}> {/* [22] */}
                                        <ul className="list-disc pl-10 pr-4 py-2 text-gray-600 border-t border-gray-300">
                                            {chapter.chapterContent.map((lecture, i) => (
                                                <li key={i} className="flex items-start gap-2 py-1"> {/* [23] */}
                                                    <img src={assets.play_icon} alt="play icon" className="w-4 h-4 mt-1" />
                                                    <div className="flex items-center justify-between w-full text-gray-800 text-sm md:text-default">
                                                        <p>{lecture.lectureTitle}</p> {/* [24] */}
                                                        <div className="flex gap-2">
                                                            {lecture.isPreviewFree && (
                                                                <p 
                                                                    onClick={() => setPlayerData({
                                                                        videoId: lecture.lectureUrl.split('/').pop()
                                                                    })} // [25, 26]
                                                                    className="text-blue-500 cursor-pointer"
                                                                >
                                                                    Preview
                                                                </p>
                                                            )}
                                                            <p>
                                                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"] })} {/* [23, 24] */}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Full Course Description */}
                    <div className="py-20 text-sm md:text-default">
                        <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
                        <p 
                            className="pt-3 rich-text" 
                            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}  // [27]
                        />
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-300px sm:min-w-420px"> {/* [28] */}
                    
                    {/* Thumbnail OR YouTube Video Preview */}
                    {playerData ? (
                        <YouTube 
                            videoId={playerData.videoId} 
                            opts={{ playerVars: { autoplay: 1 } }} 
                            iframeClassName="w-full aspect-video" 
                        /> // [29, 30]
                    ) : (
                        <img src={courseData.courseThumbnail} alt="Course Thumbnail" /> // [31]
                    )}

                    <div className="p-5">
                        <div className="flex items-center gap-2">
                            <img className="w-3.5" src={assets.time_left_clock_icon} alt="time left clock icon" />
                            <p className="text-red-500"><span className="font-medium">5 days left</span> at this price!</p> {/* [32] */}
                        </div>
                        
                        {/* Course Price Calculation */}
                        <div className="flex gap-3 items-center pt-2">
                            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                                {currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)} {/* [33] */}
                            </p>
                            <p className="text-gray-500 line-through md:text-lg text-base">
                                {currency}{courseData.coursePrice} {/* [34] */}
                            </p>
                            <p className="text-gray-500 md:text-lg text-base">{courseData.discount}% off</p>
                        </div>

                        {/* Additional Metadata */}
                        <div className="flex items-center text-sm md:text-default gap-4 pt-4 text-gray-500">
                            <div className="flex items-center gap-1">
                                <img src={assets.star} alt="star icon" />
                                <p>{calculateRating(courseData)}</p> {/* [35, 36] */}
                            </div>
                            <div className="h-4 w-px bg-gray-500/40"></div>
                            <div className="flex items-center gap-1">
                                <img src={assets.time_clock_icon} alt="clock icon" />
                                <p>{calculateCourseDuration(courseData)}</p> {/* [37] */}
                            </div>
                            <div className="h-4 w-px bg-gray-500/40"></div>
                            <div className="flex items-center gap-1">
                                <img src={assets.lesson_icon} alt="lesson icon" />
                                <p>{calculateNoOfLectures(courseData)} lessons</p> {/* [4, 37] */}
                            </div>
                        </div>

                        {/* Dummy Enroll Button (No onClick API logic yet) */}
                        <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">
                            {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'} {/* [38] */}
                        </button>

                        {/* What's in the course list */}
                        <div className="pt-6">
                            <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
                            <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                                <li>Lifetime access with free updates.</li>
                                <li>Step-by-step, hands-on project building.</li> {/* [39] */}
                                <li>Downloadable resources and source code.</li>
                                <li>Quizzes to test your knowledge.</li>
                                <li>Certificate of completion.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer /> {/* [6] */}
        </>
    );
};

export default CourseDetails;