import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import humanizeDuration from "humanize-duration";
export const AppContext = createContext(); // [4]
export const AppContextProvider = (props) => { // [5]
    
    // Environment Variables & Routing
    const currency = import.meta.env.VITE_CURRENCY; // [6]
    const navigate = useNavigate(); // [7]

    // Global States
    const [allCourses, setAllCourses] = useState([]); // [1]
    const [isEducator, setIsEducator] = useState(true); // [3]
    const [enrolledCourses, setEnrolledCourses] = useState([]); // [8]

    // Fetch dummy courses for the general list
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses); // [9]
    };

    // Fetch dummy courses specifically for the student's enrollments
    const fetchUserEnrolledCourses = async () => {
        setEnrolledCourses(dummyCourses); // [8]
    };

    // Function to calculate average rating of a course
    const calculateRating = (course) => {
        if (course.courseRatings.length === 0) { // [10]
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => { // [11]
            totalRating += rating.rating;
        });
        return Math.floor(totalRating / course.courseRatings.length); // [11, 12]
    };

    // Function to calculate the duration of a single chapter
    const calculateChapterTime = (chapter) => {
        let time = 0; // [13]
        chapter.chapterContent.map((lecture) => {
            time += lecture.lectureDuration; // [14]
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] }); // [14]
    };

    // Function to calculate the total duration of the entire course
    const calculateCourseDuration = (course) => {
        let time = 0; // [15]
        course.courseContent.map((chapter) => {
            chapter.chapterContent.map((lecture) => {
                time += lecture.lectureDuration; // [16]
            });
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] }); // [16]
    };

    // Function to calculate the total number of lectures in a course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0; // [16]
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) { // [17]
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures; // [17]
    };

    // Trigger dummy data fetching when the context mounts
    useEffect(() => {
        fetchAllCourses(); // [18]
        fetchUserEnrolledCourses(); // [19]
    }, []);

    // Bundle all states and functions to share globally
    const value = {
        currency, // [6]
        navigate, // [7]
        allCourses, 
        setAllCourses,
        isEducator, 
        setIsEducator, // [3]
        enrolledCourses, 
        setEnrolledCourses, // [19]
        calculateRating, // [11]
        calculateChapterTime, // [20]
        calculateCourseDuration, // [20]
        calculateNoOfLectures, // [20]
        fetchUserEnrolledCourses // [19]
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider> // [5]
    );
};