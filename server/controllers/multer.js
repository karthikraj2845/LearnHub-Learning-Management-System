import multer from 'multer';

// Create a storage variable
const storage = multer.diskStorage({});

// Initialize upload variable with the storage configuration
const upload = multer({ storage });

// Export the upload configuration
export default upload;