import { Webhook } from 'svix'; // [2]
import User from '../models/user.js'; // [2]

// API controller function to manage Clerk user with database
export const clerkWebhooks = async (req, res) => { // [3]
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET); // [3]

        // Verify the headers
        await whook.verify(JSON.stringify(req.body), { // [3]
            "svix-id": req.headers["svix-id"], // [3]
            "svix-timestamp": req.headers["svix-timestamp"], // [3]
            "svix-signature": req.headers["svix-signature"] // [4]
        });

        // Get the data and type from request body
        const { data, type } = req.body; // [4]

        // Switch case for different Clerk events
        switch (type) { // [4]
            case 'user.created': { // [5]
                const userData = {
                    _id: data.id, // [5]
                    email: data.email_addresses.email_address, // [5, 6]
                    name: data.first_name + " " + data.last_name, // [5]
                    imageUrl: data.image_url // [5]
                };
                await User.create(userData); // [7]
                res.json({}); // [7]
                break; // [7]
            }
            case 'user.updated': { // [7]
                const userData = {
                    email: data.email_addresses.email_address, // [6, 7]
                    name: data.first_name + " " + data.last_name, // [7]
                    imageUrl: data.image_url // [7]
                };
                await User.findByIdAndUpdate(data.id, userData); // [7]
                res.json({}); // [7]
                break; // [7]
            }
            case 'user.deleted': { // [8]
                await User.findByIdAndDelete(data.id); // [8]
                res.json({}); // [8]
                break; // [8]
            }
            default:
                break;
        }

    } catch (error) { 
        res.json({ success: false, message: error.message }); 
    }
};