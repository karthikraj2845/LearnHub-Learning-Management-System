// import { Webhook } from 'svix';
// import User from '../models/User.js';

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const payload = req.body;

//     const headers = {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     };

//     // 🔥 DEBUG LOG (VERY IMPORTANT)
//     console.log("HEADERS:", headers);

//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     const event = whook.verify(payload, headers);

//     console.log("EVENT RECEIVED:", event.type); // 👈 MUST PRINT

//     const { data, type } = event;

//     if (type === "user.created") {
//       await User.create({
//         _id: data.id,
//         email: data.email_addresses[0].email_address,
//         name: `${data.first_name} ${data.last_name}`,
//         imageUrl: data.image_url,
//       });
//     }

//     if (type === "user.updated") {
//       await User.findByIdAndUpdate(data.id, {
//         email: data.email_addresses[0].email_address,
//         name: `${data.first_name} ${data.last_name}`,
//         imageUrl: data.image_url,
//       });
//     }

//     if (type === "user.deleted") {
//       await User.findByIdAndDelete(data.id);
//     }

//     return res.status(200).json({ success: true });

//   } catch (error) {
//     console.log("❌ WEBHOOK ERROR:", error.message);
//     return res.status(400).json({ error: error.message });
//   }
// };
app.post("/clerk", (req, res) => {
  console.log("CLERK HIT ✅");
  res.status(200).json({ success: true });
});