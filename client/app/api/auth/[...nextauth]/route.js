import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@server/models/user.model.js";
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
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

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

  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
      const isGoogle = account?.provider === "google";
      const existingUser = await User.findOne({ email: user.email });

      if (existingUser) {
        existingUser.last_login_date = new Date();

        if (isGoogle) {
          existingUser.access_token = account.access_token;
          existingUser.refresh_token = account.refresh_token;
          existingUser.avatar = user.image;
          existingUser.verify_email = true;
          existingUser.signUpWithGoogle = true;
          existingUser.provider = "google";
        }

        await existingUser.save();
      } else {
        await User.create({
          name: user.name,
          email: user.email,
          avatar: user.image || "",
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

    // async jwt({ token, user, account }) {

    //   if (user && account) {
    //     token.accessToken = account.access_token || null;
    //     token.refreshToken = account.refresh_token || null;
    //     token.accessTokenExpires = account.expires_at
    //       ? account.expires_at * 1000
    //       : Date.now() + 3600 * 1000;

    //     token.user = {
    //       _id: user._id ?? user.id,
    //       name: user.name,
    //       email: user.email,
    //       avatar: user.avatar || user.image || "",
    //       provider: user.provider,
    //     };
    //   }
      

    //   if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
    //     return token;
    //   }

    //   if (token?.user?.provider === "google") {
    //     return await refreshAccessToken(token);
    //   }

    //   return token;
    // },


    async jwt({ token, user, account }) {
  if (account) {
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token;
    token.idToken = account.id_token; // ✅ Store ID Token
    token.user = {
      _id: user._id ?? user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || user.image || "",
      provider: account.provider,
    };
  }
  return token;
},

    async session({ session, token }) {
  session.accessToken = token.accessToken;
  session.idToken = token.idToken; // ✅ Send to client
  session.user = token.user;
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
