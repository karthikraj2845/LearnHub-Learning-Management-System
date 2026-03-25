import express from "express";
import { addCourse, updateRoleToEducator } from "../controllers/educatorController.js";
import upload from "../controllers/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", upload.single("image"),protectEducator, addCourse);
// educatorRouter.post("/add-course", upload.single("image"), addCourse);
export default educatorRouter;

