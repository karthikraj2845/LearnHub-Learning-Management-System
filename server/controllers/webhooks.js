import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Pass RAW body (Buffer)
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // ✅ Convert buffer → JSON
    const body = JSON.parse(req.body.toString());

    const { data, type } = body;

    console.log("TYPE:", type);

    if (type === "user.created") {
      const userData = {
        _id: data.id,
        email: data.email_addresses[0]?.email_address,
        name: `${data.first_name || ""} ${data.last_name || ""}`,
        imageUrl: data.image_url,
      };

      console.log("Saving user:", userData);

      await User.create(userData);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(400).json({ success: false });
  }
};