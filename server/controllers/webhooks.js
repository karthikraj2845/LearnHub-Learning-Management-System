import { Webhook } from 'svix'; // [2]
import User from '../models/User.js'; // [2]

// API Controller Function to Manage Clerk User with Database
export const clerkWebhooks = async (req, res) => { // [4]
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET); // [4]

        // Verify the headers
        await whook.verify(JSON.stringify(req.body), { // [4]
            "svix-id": req.headers["svix-id"], // [3]
            "svix-timestamp": req.headers["svix-timestamp"], // [3]
            "svix-signature": req.headers["svix-signature"] // [3]
        });

        // Get the data and type from request body
        const { data, type } = req.body; // [3]

        // Switch case for different Clerk events
        switch (type) { // [3]
            case 'user.created': { // [5]
                const userData = {
                    _id: data.id,
                    email: data.email_addresses.email_address, // [1]
                    name: data.first_name + " " + data.last_name, // [5]
                    imageUrl: data.image_url // [5]
                };
                await User.create(userData); // [6]
                res.json({}); // [6]
                break;
            }
            case 'user.updated': { // [6]
                const userData = {
                    email: data.email_addresses.email_address, // [1]
                    name: data.first_name + " " + data.last_name, // [6]
                    imageUrl: data.image_url // [6]
                };
                await User.findByIdAndUpdate(data.id, userData); // [6]
                res.json({}); // [6]
                break;
            }
            case 'user.deleted': { // [7]
                await User.findByIdAndDelete(data.id); // [7]
                res.json({}); // [7]
                break;
            }
            default:
                break;
        }

    } catch (error) { // [7]
        res.json({ success: false, message: error.message }); // [1]
    }
};