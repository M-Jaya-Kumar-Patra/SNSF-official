// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { fetchDataFromApi } from "@/utils/api";

// export const AdminContext = createContext();

// export function AdminProvider({ children }) {
//   const [adminData, setAdminData] = useState(null);
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
//       setAdminData(null);
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;

//     console.log("AdminContext triggered");

//     const fetchAdminDetails = async () => {
//       const token = localStorage.getItem("accessToken");

//       if (!token) {
//         console.warn("No access token found.");
//         setAdminData(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log("Fetching admin details with token...");
//         const response = await fetchDataFromApi(`/api/admin/admin-details`);

//         if (!response.error) {
//           setAdminData(response.data);
//           setIsLogin(true)
//           // console.log("Fetched admin data:", response.data);
          
//         } else {
//           console.error("API returned error:", response.message);
//           if(response.message==='Something is wrong'){
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");

//             alert.alertBox("error", "Your session is closed, please login again")

//             setIsLogin(false)

//           }
//           setAdminData(null);
//         }
//       } catch (err) {
//         console.error("Error fetching admin details:", err);
//         setAdminData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdminDetails();
//   }, [mounted]);

//   return (
//     <AdminContext.Provider value={{ adminData, setAdminData, loading, isLogin }}>
//       {children}
//     </AdminContext.Provider>
//   );
// }

// export const useAdmin = () => useContext(AdminContext);
