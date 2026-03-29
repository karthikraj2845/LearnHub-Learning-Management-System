import { Webhook } from "svix";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import Stripe from "stripe";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString();

    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(payload);

    console.log("Webhook event:", type);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "User",
      imageUrl: data.image_url || ""
    };

    switch (type) {
      case "user.created":
      case "user.updated":
        await User.findByIdAndUpdate(
          data.id,
          userData,
          { upsert: true, new: true }
        );
        console.log("✅ User saved/updated");
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted");
        break;
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.log("❌ WEBHOOK ERROR:", error.message);
    res.status(400).json({ success: false });
  }
};
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhooks = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];

    const event = stripeInstance.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object;

        console.log("METADATA:", session.metadata);

        const purchaseId = session.metadata?.purchaseId;

        if (!purchaseId) {
          throw new Error("purchaseId missing in metadata");
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          throw new Error("Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        if (!userData || !courseData) {
          throw new Error("User or Course not found");
        }

        if (purchaseData.status === 'completed') break;

        // courseData.enrolledStudents.push(userData._id);
        // await courseData.save();

        // userData.enrolledCourses.push(courseData._id);
        // await userData.save();
        await Course.findByIdAndUpdate(courseData._id, {
          $addToSet: { enrolledStudents: userData._id }
        });

        await User.findByIdAndUpdate(userData._id, {
          $addToSet: { enrolledCourses: courseData._id }
        });

        purchaseData.status = 'completed';
        await purchaseData.save();

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;

        const purchaseId = paymentIntent.metadata?.purchaseId;

        if (!purchaseId) break; // avoid crash

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) break;

        // Only mark failed if not already completed
        if (purchaseData.status !== 'completed') {
          purchaseData.status = 'failed';
          await purchaseData.save();
        }

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    res.json({ received: true });

  } catch (error) {
    console.error(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};