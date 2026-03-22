import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const { data, type } = req.body;

        console.log("🔥 Webhook triggered:", type);

        switch (type) {

            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address, // ✅ FIXED
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url
                };

                console.log("Creating user:", userData);

                await User.create(userData);

                console.log("✅ User saved");
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address, // ✅ FIXED
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url
                };

                await User.findByIdAndUpdate(data.id, userData);

                console.log("🟡 User updated");
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                console.log("🔴 User deleted");
                break;
            }

            default:
                console.log("⚠️ Unknown event:", type);
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};