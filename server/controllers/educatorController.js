import { createClerkClient } from "@clerk/express";
import Course from "../models/Course.js";
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