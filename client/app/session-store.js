// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect } from "react";

// export default function SessionSync() {
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     const currentToken = localStorage.getItem("accessToken");

//     if (status === "authenticated" && session?.accessToken) {
//       if (currentToken !== session.accessToken) {
//         localStorage.setItem("accessToken", session.accessToken);
//         console.log("✅ Access token updated in localStorage");
//       }
//     } else if (status === "unauthenticated" && currentToken) {
//       localStorage.removeItem("accessToken");
//       console.log("⚠️ Access token removed from localStorage");
//     }
//   }, [session?.accessToken, status]);

//   return null;
// }
