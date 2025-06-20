"use client";
import { AuthProvider } from "../app/context/AuthContext";
 // your custom context

const AuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
