import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useAlert } from "@/app/context/AlertContext";
import { useRouter } from "next/navigation";

const SignInWithGoogle = () => {
  const router = useRouter();
  const alert = useAlert();
  const { isLogin, login, setIsLogin, isCheckingToken, setIsCheckingToken } =
    useAuth();

  return (
    <div className="">
      <GoogleLogin
        onSuccess={async (cred) => {
          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/user/authWithGoogle`,
              { token: cred.credential },
              { withCredentials: true }
            );

            if (res.data.success) {
              alert.alertBox({ type: "success", msg: "Login successful" });

              // update context if needed
              // setIsLogin(true)

              console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee:", res.data.user.email);

              const token = res.data.user.accessToken;
              login(res.data, token);

              // localStorage.setItem("accessToken", token);
              // localStorage.setItem("refreshToken", res.data.user.refreshToken);
              // localStorage.setItem("email", res.data.user.email);

              // setFormFields({ email: "", password: "" });
              // setIsLogin(true);
              router.push("/profile");

              window.location.reload();
            }
          } catch (err) {
            console.log("EEEEEEEEEEEERRROR: ", err);
            alert.alertBox({ type: "error", msg: "Login failed" });
          }
        }}
      />
    </div>
  );
};

export default SignInWithGoogle;
