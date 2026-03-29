import Course from "../models/Course.js";   
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select("-courseContent -enrolledStudents")
            .populate("educator", "name imageUrl") // only needed fields
            .lean();

        res.json({
            success: true,
            count: courses.length,
            courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCourseId = async (req, res) => {
    try {
        const { id } = req.params;

        const courseData = await Course.findById(id)
            .populate("educator", "name imageUrl")
            .lean();

        // ❗ Handle course not found
        if (!courseData) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // 🔐 Sanitize content (do NOT mutate original)
        const sanitizedContent = courseData.courseContent.map(chapter => ({
            ...chapter,
            chapterContent: chapter.chapterContent.map(lecture => ({
                ...lecture,
                lectureUrl: lecture.isPreviewFree ? lecture.lectureUrl : ""
            }))
        }));

        res.json({
            success: true,
            courseData: {
                ...courseData,
                courseContent: sanitizedContent
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
