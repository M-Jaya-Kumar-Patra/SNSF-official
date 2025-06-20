// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import User from "@server/models/user.model.js";
import connectDB from "@server/lib/database.js";
import bcrypt from "bcryptjs";

// Optional: token refresh logic if needed
async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const refreshed = await response.json();
    if (!response.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

// ✅ Use dynamic import to fix ESM issues
const authHandler = async (req) => {
  const GoogleProviderImport = await import("next-auth/providers/google");
  const CredentialsProviderImport = await import("next-auth/providers/credentials");

  const GoogleProvider = GoogleProviderImport.default || GoogleProviderImport;
  const CredentialsProvider = CredentialsProviderImport.default || CredentialsProviderImport;

  return NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });
          if (!user) throw new Error("No user found");
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Invalid password");

          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            provider: "credentials",
          };
        },
      }),
    ],
    // ... rest of your config stays the same
  })(req);
};


// ✅ Export properly for App Router
export const GET = authHandler;
export const POST = authHandler;
