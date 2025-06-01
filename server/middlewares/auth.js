import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = async (req, res, next) => {
  try {
    console.log("🔐 Cookies:", req.cookies);
    console.log("🔐 Authorization header:", req.headers.authorization);

    let token = null;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query?.accessToken || req.query?.token) {
      token = req.query.accessToken || req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided", error: true });
    }

    let userId;

    try {
      // First: Verify as Google id_token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      userId = payload.sub;
      console.log("✅ Google ID token verified:", userId);
    } catch (googleError) {
      console.log("⚠️ Not a Google ID token, trying custom JWT");

      // Fallback: Verify custom JWT
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
      userId = decoded._id;
      console.log("✅ JWT verified:", userId);
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: error.message || "Unauthorized",
      error: true,
    });
  }
};

export default auth;
