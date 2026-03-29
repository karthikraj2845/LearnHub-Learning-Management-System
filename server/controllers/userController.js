import User from '../models/User.js';
import { clerkClient } from "@clerk/clerk-sdk-node";
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
// import CourseProgress from '../models/courseProgress.js';
import Stripe from 'stripe';

// Get User Data
export const getUserData = async (req, res) => {
    try {
        // const userId = req.auth.userId;
        const userId = req.userId;

        let user = await User.findById(userId);

        if (!user) {
            console.log("Fetching from Clerk...");

            // 🔥 Fetch FULL user from Clerk
            const clerkUser = await clerkClient.users.getUser(userId);

            const email = clerkUser.emailAddresses[0]?.emailAddress || "";
            const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
            const imageUrl = clerkUser.imageUrl || "";

            user = await User.create({
                _id: userId,
                name,
                email,
                imageUrl
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get User Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const userData = await User.findById(userId)
            .populate({
                path: "enrolledCourses",
                select: "courseTitle thumbnail price educator"
            })
            .lean();

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const courses = userData.enrolledCourses || [];

        res.json({
            success: true,
            count: courses.length,
            enrolledCourses: courses
        });

    } catch (error) {
        console.error("Enrolled Courses Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Purchase Course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth?.userId || req.userId;

        if (!courseId) {
            return res.json({ success: false, message: "CourseId required" });
        }

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data not found' });
        }

        // ❌ Prevent duplicate purchase
        const existingPurchase = await Purchase.findOne({
            userId,
            courseId,
            status: "completed"
        });

        if (existingPurchase) {
            return res.json({
                success: false,
                message: "Course already purchased"
            });
        }

        // ✅ Calculate amount properly
        const amount = Math.floor(
            (courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100) * 10
        );

        const newPurchase = await Purchase.create({
            courseId,
            userId,
            amount,
            status: "pending"
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: amount * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Purchase Error:", error);
        res.json({ success: false, message: error.message });
    }
};
// // Update User Course Progress
export const updateCourseProgress = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId;
        const { courseId, lectureId } = req.body;

        // 🔐 Auth check
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 📥 Validation
        if (!courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: "courseId and lectureId are required"
            });
        }

        // 🚀 Update progress (no duplicates)
        const progressData = await CourseProgress.findOneAndUpdate(
            { userId, courseId },
            {
                $addToSet: { lectureCompleted: lectureId }
            },
            {
                new: true,
                upsert: true
            }
        ).lean();

        res.json({
            success: true,
            message: "Progress updated",
            progress: progressData
        });

    } catch (error) {
        console.error("Update Progress Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// // Get User Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId;
        const { courseId } = req.body;

        // 🔐 Auth check
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 📥 Validation
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "courseId is required"
            });
        }

        // 🔍 Fetch progress
        const progressData = await CourseProgress.findOne({
            userId,
            courseId
        }).lean();

        // 📭 If no progress yet
        if (!progressData) {
            return res.json({
                success: true,
                message: "No progress found",
                progressData: {
                    lectureCompleted: []
                }
            });
        }

        res.json({
            success: true,
            progressData
        });

    } catch (error) {
        console.error("Get Progress Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// // Add User Rating to Course
export const addUserRating = async (req, res) => {
    try {
        const userId = req.auth?.userId || req.userId;
        const { courseId, rating } = req.body;

        // 🔐 Auth check
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // 📥 Validation
        if (!courseId || !rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Invalid courseId or rating (1–5 required)"
            });
        }

        // 🔍 Fetch course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // 🔍 Check user enrollment
        const user = await User.findById(userId);
        if (
            !user ||
            !user.enrolledCourses.some(
                (id) => id.toString() === courseId.toString()
            )
        ) {
            return res.status(403).json({
                success: false,
                message: "User has not purchased this course"
            });
        }

        // ⭐ Add or update rating
        const existingRatingIndex = course.courseRatings.findIndex(
            (r) => r.userId.toString() === userId.toString()
        );

        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        res.json({
            success: true,
            message: "Rating submitted successfully"
        });

    } catch (error) {
        console.error("Add Rating Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};