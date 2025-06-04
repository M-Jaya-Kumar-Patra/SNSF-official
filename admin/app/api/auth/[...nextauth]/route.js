import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Admin from "@server/models/admin.model.js";
import connectDB from "@server/lib/database.js";
import bcrypt from "bcryptjs";
import jwtLib from "jsonwebtoken";

// Refresh Google access token if needed
async function refreshAccessToken(token) {
  try {
    const url = "https://oauth2.googleapis.com/token?" +
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

const handler = NextAuth({
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
        const admin = await Admin.findOne({ email: credentials.email });
        if (!admin) throw new Error("No admin found with this email");
        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) throw new Error("Invalid password");

        return {
          _id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          avatar: admin.avatar,
          provider: "credentials",
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ admin, account }) {
      await connectDB();
      const isGoogle = account?.provider === "google";
      const existingAdmin = await Admin.findOne({ email: admin.email });

      if (existingAdmin) {
        existingAdmin.last_login_date = new Date();

        if (isGoogle) {
          existingAdmin.access_token = account.access_token;
          existingAdmin.refresh_token = account.refresh_token;
          existingAdmin.avatar = admin.image;
          existingAdmin.verify_email = true;
          existingAdmin.signUpWithGoogle = true;
          existingAdmin.provider = "google";
        }

        await existingAdmin.save();
      } else {
        await Admin.create({
          name: admin.name,
          email: admin.email,
          avatar: admin.image || "",
          provider: isGoogle ? "google" : "credentials",
          role: "USER",
          signUpWithGoogle: isGoogle,
          verify_email: isGoogle,
          access_token: account.access_token || "",
          refresh_token: account.refresh_token || "",
          last_login_date: new Date(),
        });

      }

      return true;
    },

    // async jwt({ token, admin, account }) {

    //   if (admin && account) {
    //     token.accessToken = account.access_token || null;
    //     token.refreshToken = account.refresh_token || null;
    //     token.accessTokenExpires = account.expires_at
    //       ? account.expires_at * 1000
    //       : Date.now() + 3600 * 1000;

    //     token.admin = {
    //       _id: admin._id ?? admin.id,
    //       name: admin.name,
    //       email: admin.email,
    //       avatar: admin.avatar || admin.image || "",
    //       provider: admin.provider,
    //     };
    //   }
      

    //   if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
    //     return token;
    //   }

    //   if (token?.admin?.provider === "google") {
    //     return await refreshAccessToken(token);
    //   }

    //   return token;
    // },


    async jwt({ token, admin, account }) {
  if (account) {
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
    token.idToken = account.id_token; // ✅ Store ID Token
    token.admin = {
      _id: admin._id ?? admin.id,
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar || admin.image || "",
      provider: account.provider,
    };
  }
  return token;
},

    async session({ session, token }) {
  session.accessToken = token.accessToken;
  session.idToken = token.idToken; // ✅ Send to client
  session.admin = token.admin;
  return session;
}
,
  },

  pages: {
    signIn: "/login", // your custom login page
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
