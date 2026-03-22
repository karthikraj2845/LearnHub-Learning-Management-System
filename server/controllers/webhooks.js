import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body; // raw buffer

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const event = whook.verify(payload, headers); // ✅ NO stringify

    const { data, type } = event;

    switch (type) {
      case 'user.created':
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case 'user.updated':
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case 'user.deleted':
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message); // 👈 CHECK THIS IN VERCEL LOGS
    res.status(400).json({ success: false });
  }
};