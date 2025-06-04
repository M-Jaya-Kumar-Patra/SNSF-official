import bcrypt from "bcryptjs";
import Admin from "@/models/admin.model.js";
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

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      return new Response(JSON.stringify({ message: "Admin already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const admin = new Admin({
      name,
      email,
      phone:123,
      password: hashedPassword,
      provider: "credentials",
      signUpWithGoogle: false,
      status: "Active",
      verify_email: true,
    });

    await admin.save();
    console.log("Admin saved:", admin._id);

    // Generate tokens
    const accessToken = data.accessToken
    const refreshToken = data.refreshToken
    console.log("Tokens generated");

    // Save tokens in admin document
    admin.access_token = accessToken;
    admin.refresh_token = refreshToken;
    await admin.save();
    console.log("Tokens saved in DB");

    return new Response(
      JSON.stringify({
        message: "Admin registered successfully",
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
