import { createClerkClient } from "@clerk/express";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // ✅ base64url decode (same as controller)
    const base64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(
      Buffer.from(base64, "base64").toString()
    );

    const userId = payload?.sub;

    console.log("MIDDLEWARE USER:", userId);

    if (!userId || !userId.startsWith("user_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid user",
      });
    }

    // ✅ fetch user from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Not an educator",
      });
    }

    // ✅ attach to request (optional but useful)
    req.userId = userId;

    next();

  } catch (error) {
    console.error("MIDDLEWARE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token"
            });
        }

        const base64 = token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/");

        const payload = JSON.parse(
            Buffer.from(base64, "base64").toString()
        );

        const userId = payload?.sub;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            });
        }

        req.userId = userId;

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};