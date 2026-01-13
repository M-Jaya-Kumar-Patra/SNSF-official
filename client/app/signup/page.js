import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SignupClient from "./SignupClient";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  // ✅ If already logged in → profile
  if (session) {
    redirect("/profile"); // or "/dashboard"
  }

  return <SignupClient />;
}
