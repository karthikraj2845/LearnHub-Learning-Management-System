// import { Webhook } from 'svix';
// import User from '../models/User.js';

// // API Controller Function to Manage Clerk User with Database
// export const clerkWebhooks = async (req, res) => {
//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         // Verify the headers
//         await whook.verify(JSON.stringify(req.body), {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"]
//         });

//         // Get the data and type from request body
//         const { data, type } = req.body;

//         // Switch case for different Clerk events
//         switch (type) {
//             case 'user.created': {
//                 const userData = {
//                     _id: data.id,
//                     // Corrected: Added  to properly target the first email in the array
//                     email: data.email_addresses.email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.image_url
//                 };
//                 await User.create(userData);
//                 res.json({});
//                 break;
//             }
//             case 'user.updated': {
//                 const userData = {
//                     email: data.email_addresses.email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.image_url
//                 };
//                 await User.findByIdAndUpdate(data.id, userData);
//                 res.json({});
//                 break;
//             }
//             case 'user.deleted': {
//                 await User.findByIdAndDelete(data.id);
//                 res.json({});
//                 break;
//             }
//             default:
//                 break;
//         }

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };
import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // 🔐 Verify webhook
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = JSON.stringify(req.body);

    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    console.log("🔥 Webhook triggered:", type);
    console.log("📦 Data:", data);

    switch (type) {
      // 🟢 USER CREATED
      case "user.created": {
        const userData = {
          _id: data.id, // Clerk user ID
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.create(userData);
        console.log("✅ User created:", userData);

        break;
      }

      // 🟡 USER UPDATED
      case "user.updated": {
        const userData = {
          email: data.email_addresses?.[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url || "",
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("🟡 User updated:", userData);

        break;
      }

      // 🔴 USER DELETED
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🔴 User deleted:", data.id);

        break;
      }

      default:
        console.log("⚠️ Unhandled event type:", type);
    }

    // ✅ Always send response
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ Webhook error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};