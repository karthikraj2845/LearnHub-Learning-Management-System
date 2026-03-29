import express from 'express';
import { 
    getUserData, 
    userEnrolledCourses, 
    purchaseCourse, 
    // updateCourseProgress, 
    // getUserCourseProgress, 
    // addUserRating 
} from '../controllers/userController.js';
import { protect } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// Get user data and enrolled courses
// userRouter.get('/data', getUserData);
userRouter.get('/data', protect, getUserData);
userRouter.get('/enrolled-courses', protect, userEnrolledCourses);

// Purchase course
userRouter.post('/purchase', protect, purchaseCourse);

// // Course progress tracking (using POST because they accept data in the body)
// userRouter.post('/update-course-progress', updateCourseProgress);
// userRouter.post('/get-course-progress', getUserCourseProgress);

// // Add course rating
// userRouter.post('/add-rating', addUserRating);

export default userRouter;