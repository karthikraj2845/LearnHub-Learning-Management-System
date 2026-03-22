import { Webhook } from 'svix';
import User from '../models/User.js';

// API Controller Function to Manage Clerk User with Database
export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verify the headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Get the data and type from request body
        const { data, type } = req.body;

        // Switch case for different Clerk events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    // Corrected: Added  to properly target the first email in the array
                    email: data.email_addresses.email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                };
                await User.create(userData);
                res.json({});
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses.email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url
                };
                await User.findByIdAndUpdate(data.id, userData);
                res.json({});
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;
            }
            default:
                break;
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};