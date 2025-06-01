import bcrypt from "bcryptjs";
import User from "@/models/user.model.js";
import { connectDB } from "@/lib/database.js";
import generatedAccessToken from "@server/utils/generatedAccessToken.js";
import generatedRefreshToken from "@server/utils/generatedRefreshToken.js";

export async function POST(req) {
  try {
    console.log("Register API called");

    const { name, email, password } = await req.body();
    console.log("Received:", { name, email });

    await connectDB();
    console.log("DB connected");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const user = new User({
      name,
      email,
      phone:123,
      password: hashedPassword,
      provider: "credentials",
      signUpWithGoogle: false,
      status: "Active",
      verify_email: true,
    });

    await user.save();
    console.log("User saved:", user._id);

    // Generate tokens
    const accessToken = data.accessToken
    const refreshToken = data.refreshToken
    console.log("Tokens generated");

    // Save tokens in user document
    user.access_token = accessToken;
    user.refresh_token = refreshToken;
    await user.save();
    console.log("Tokens saved in DB");

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        accessToken,
        refreshToken,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
