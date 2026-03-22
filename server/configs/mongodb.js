import mongoose from 'mongoose'; 

// connect to the mongod DB database
const connectDB = async () => { 
    
    // 1. Register an event listener to confirm connection
    mongoose.connection.on('connected', () => {
        console.log("database connected"); 
    });

    // 2. Connect to the database using the environment variable and append the database name
    await mongoose.connect(`${process.env.MONGODB_URI}/lms`); 
};

export default connectDB; 