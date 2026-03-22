import { Webhook } from 'svix';
import Stripe from 'stripe';
import User from '../../models/User.js';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';

// Initialize Stripe Instance
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// API Controller Function to Manage Stripe Payment Webhooks
export const stripeWebhooks = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];

        // Construct the Stripe event
        const event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const paymentId = paymentIntent.id;

                // Retrieve the checkout session to get metadata
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentId
                });

                const purchaseId = session.data.metadata.purchaseId;
                const purchaseData = await Purchase.findById(purchaseId);
                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                // Update course and user enrollment data
                courseData.enrolledStudents.push(userData);
                await courseData.save();

                userData.enrolledCourses.push(courseData._id);
                await userData.save();

                // Update purchase status
                purchaseData.status = 'completed';
                await purchaseData.save();

                break;
            }
            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const paymentId = paymentIntent.id;

                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentId
                });

                const purchaseId = session.data.metadata.purchaseId;
                const purchaseData = await Purchase.findById(purchaseId);

                // Update purchase status
                purchaseData.status = 'failed';
                await purchaseData.save();

                break;
            }
            default:
                console.log("Unhandled event type", event.type);
                break;
        }

        // Return a response to acknowledge receipt of the event
        res.json({ received: true });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};