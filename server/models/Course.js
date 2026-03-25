import mongoose from 'mongoose';

// 1. Lecture Schema
const lectureSchema = new mongoose.Schema({
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true }
}, { _id: false }); // _id is false because we generate unique IDs from the frontend using the unique-id package

// 2. Chapter Schema
const chapterSchema = new mongoose.Schema({
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema] // Nests the lecture schema
}, { _id: false });

// 3. Main Course Schema
const courseSchema = new mongoose.Schema({
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    coursePrice: { type: Number, required: true },
    isPublished: { type: Boolean, default: true },
    discount: { type: Number, required: true, min: 0, max: 100 },
    courseContent: [chapterSchema], // Nests the chapter schema
    courseRatings: [
        { 
            userId: { type: String }, 
            rating: { type: Number, min: 1, max: 5 } 
        }
    ],
    educator: { type: String, ref: 'user', required: true },
    enrolledStudents: [
        { type: String, ref: 'user' }
    ]
}, { 
    timestamps: true, 
    minimize: false // Ensures properties without values are still created in the database
});

const Course = mongoose.model('course', courseSchema);

export default Course;