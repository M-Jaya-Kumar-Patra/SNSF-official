  "use client";

  import { createContext, useContext, useState, useEffect } from "react";
  import { jwtDecode } from "jwt-decode";
  import { fetchDataFromApi } from "@/utils/api";
  import { useRouter } from "next/navigation";

  const AuthContext = createContext();

  export const AuthProvider = ({ children }) => {
    const router = useRouter()
    const [userData, setUserData] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      console.log("ac1")
      const token = localStorage.getItem("accessToken")
      console.log("ac2")
      const email = localStorage.getItem("email")
      console.log("ac3")

      if (!token) { 
      console.log("ac4")
      
        setIsLogin(false);
      console.log("ac5")

        setUserData(null);
      console.log("ac6")

      setLoading(false);
      console.log("ac7")
        return;
      }


      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          logout();
        } else {
          const timeLeft = (decoded.exp - currentTime) * 1000;
          setTimeout(() => logout(), timeLeft);
          fetchUserDetails();
      console.log("ac1last")
        }
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    }, []);

    const fetchUserDetails = async () => {
      try {
        console.log("userdetails    mjjj")
        const response = await fetchDataFromApi("/api/user/user-details");
        if (!response.error) {
          setUserData(response.data);
          setIsLogin(true);
        } else {
          console.error("API error:", response.message);
          if (response.message === "Something is wrong") {
            alert("Your session is closed, please login again");
          }
          logout();
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    const login = (data, token) => {
      if (data && token) {
        localStorage.setItem("accessToken", token);
        setUserData(data);
        setIsLogin(true);
        console.log("login called in auth context")
      }
    };

    const logout = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUserData(null);
      setIsLogin(false);
    };

    return (
      <AuthContext.Provider value={{ userData, isLogin, setIsLogin, setUserData, loading, setLoading, login, logout}}>
        {children}
      </AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);


  // "use client";

  // import { createContext, useContext, useState, useEffect } from "react";
  // import { useRouter } from "next/navigation";
  // import { jwtDecode } from "jwt-decode";
  // import { fetchDataFromApi } from "@/utils/api";

  // const AuthContext = createContext();

  // export const AuthProvider = ({ children }) => {
  //   const [userData, setUserData] = useState(null);
  //   const [isLogin, setIsLogin] = useState(false);
  //   const [loading, setLoading] = useState(true);
  //   const router = useRouter();


  //   useEffect(() => {
  //     const initAuth = async () => {
  //       const token = localStorage.getItem("accessToken");

  //       if (!token) {
  //         logout();
  //         setLoading(false);
  //         return;
  //       }

  //       try {
  //         const decoded = jwtDecode(token);
  //         const currentTime = Date.now() / 1000;

  //         if (decoded.exp < currentTime) {
  //           logout();
  //         } else {
  //           const timeLeft = (decoded.exp - currentTime) * 1000;
  //           setTimeout(() => logout(), timeLeft);
  //           await fetchUserDetails(); // load user info
  //         }
  //       } catch (err) {
  //         console.error("Invalid token", err);
  //         logout();
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     initAuth();

  //     const handleRouteChange = async () => {
  //       const token = localStorage.getItem("accessToken");
  //       if (token) await fetchUserDetails(); // re-fetch on route change
  //     };

  //     router.events?.on("routeChangeComplete", handleRouteChange);

  //     return () => {
  //       router.events?.off("routeChangeComplete", handleRouteChange);
  //     };
  //   }, []);

  //   const fetchUserDetails = async () => {
  //     try {
  //       const response = await fetchDataFromApi("/api/user/user-details");
  //       if (!response.error) {
  //         setUserData(response.data);
  //         setIsLogin(true);
  //       } else {
  //         console.error("API error:", response.message);
  //         if (response.message === "Something is wrong") {
  //           alert("Your session is closed, please login again");
  //         }
  //         logout();
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user details", error);
  //       logout();
  //     }
  //   };

  //   const login = (data, token) => {
  //     if (data && token) {
  //       localStorage.setItem("accessToken", token);
  //       setUserData(data);
  //       setIsLogin(true);
  //     }
  //   };

  //   const logout = () => {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //     setUserData(null);
  //     setIsLogin(false);
  //   };

  //   const values = { userData, isLogin, setIsLogin, setUserData, loading, setLoading, login, logout };

  //   return (
  //     <AuthContext.Provider value={values}>
  //       {loading ? <div>Loading...</div> : children}
  //     </AuthContext.Provider>
  //   );
  // };

  // export const useAuth = () => useContext(AuthContext);
