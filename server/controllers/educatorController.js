import { createClerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// ✅ 1. UPDATE ROLE
export const updateRoleToEducator = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // ✅ FIXED decoding
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      Buffer.from(base64, "base64").toString()
    );

    const userId = payload?.sub;

    console.log("USER ID:", userId);

    if (!userId || !userId.startsWith("user_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid userId",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({
      success: true,
      message: "You can publish a course now!",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ 2. ADD COURSE
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      Buffer.from(base64, "base64").toString()
    );

    const educatorId = payload?.sub;

    console.log("EDUCATOR ID:", educatorId);

    if (!educatorId || !educatorId.startsWith("user_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid userId",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Course image required",
      });
    }

    const parsedCourseData = JSON.parse(courseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    parsedCourseData.educator = educatorId;
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    res.json({
      success: true,
      message: "Course Added",
      course: newCourse,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getEducatorCourses = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // ✅ decode JWT (same as your other functions)
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      Buffer.from(base64, "base64").toString()
    );

    const educatorId = payload?.sub;

    console.log("EDUCATOR ID:", educatorId);

    if (!educatorId || !educatorId.startsWith("user_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // ✅ fetch courses from DB
    const courses = await Course.find({ educator: educatorId });

    res.json({
      success: true,
      courses,
    });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // 1️⃣ Get courses
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // 2️⃣ Get all completed purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        })
        .populate("courseId", "courseTitle")
        .lean();

        // 3️⃣ Total earnings
        const totalEarnings = purchases.reduce(
            (sum, p) => sum + p.amount,
            0
        );

        // 4️⃣ Get unique student IDs
        const studentIds = [...new Set(purchases.map(p => p.userId))];

        // 5️⃣ Fetch students in ONE query ✅
        const students = await User.find(
            { _id: { $in: studentIds } },
            "name imageUrl"
        ).lean();

        // Map for quick lookup
        const studentMap = {};
        students.forEach(s => {
            studentMap[s._id] = s;
        });

        // 6️⃣ Build enrolledStudentsData
        const enrolledStudentsData = purchases.map(p => ({
            courseTitle: p.courseId.courseTitle,
            student: studentMap[p.userId]
        }));

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                totalCourses,
                totalStudents: studentIds.length,
                enrolledStudentsData
            }
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        });
    }
};
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // 1️⃣ Get educator courses
        const courses = await Course.find({ educator }).select("_id");
        const courseIds = courses.map(c => c._id);

        // 2️⃣ Get purchases with population
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        })
        .populate("userId", "name imageUrl")
        .populate("courseId", "courseTitle")
        .sort({ createdAt: -1 }) // latest first
        .lean(); // ⚡ performance boost

        // 3️⃣ Format response
        const enrolledStudents = purchases.map(p => ({
            student: p.userId,
            courseTitle: p.courseId?.courseTitle,
            purchaseDate: p.createdAt
        }));

        res.json({
            success: true,
            count: enrolledStudents.length,
            enrolledStudents
        });

    } catch (error) {
        console.error("Error fetching enrolled students:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};