import mongoose from 'mongoose';

// connect to MongoDB
const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("database connected");
    });

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: "learnhub", // ✅ correct way
    });
};

export default connectDB;