// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { fetchDataFromApi } from "@/utils/api";

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const [isLogin, setIsLogin] = useState(false)

//   useEffect(() => {
//     setMounted(true);
//      const token = localStorage.getItem("accessToken");

//     if (token) {
//       setIsLogin(true);
//     } else {
//       setIsLogin(false);
//       setUserData(null);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;

//     console.log("UserContext triggered");

//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         console.warn("No access token found.");
//         setUserData(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log("Fetching user details with token...");
//         const response = await fetchDataFromApi(`/api/user/user-details`);

//         if (!response.error) {
//           setUserData(response.data);
//           setIsLogin(true)
//           // console.log("Fetched user data:", response.data);
          
//         } else {
//           console.error("API returned error:", response.message);
//           if(response.message==='Something is wrong'){
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");

//             alert.alertBox("error", "Your session is closed, please login again")

//             setIsLogin(false)

//           }
//           setUserData(null);
//         }
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//         setUserData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [mounted]);

//   return (
//     <UserContext.Provider value={{ userData, setUserData, loading, isLogin }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useUser = () => useContext(UserContext);
