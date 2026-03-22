import mongoose from 'mongoose'; 

// Define the User Schema
const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true }, 
        email: { type: String, required: true }, 
        imageUrl: { type: String, required: true }, 
        enrolledCourses: [ 
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'course' 
            }
        ]
    },
    { 
        timestamps: true
    }
);

// Create the User model
const User = mongoose.model('user', userSchema);

// Export the User model
export default User; 