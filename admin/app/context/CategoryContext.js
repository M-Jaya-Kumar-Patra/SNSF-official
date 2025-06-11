  "use client";

  import { createContext, useContext, useState, useEffect } from "react";
  import { jwtDecode } from "jwt-decode";
  import { fetchDataFromApi } from "@/utils/api";
  import { useRouter } from "next/navigation";

  const CategoryContext = createContext();

  export const CatProvider = ({ children }) => {
    const router = useRouter()
    const [adminData, setAdminData] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);


    const [catData, setCatData] = useState([])

    const getCategories = () => {
            fetchDataFromApi("/api/category/getCategories").then((response) => {
                setCatData(response?.data);
            });
        }
        
    useEffect(() => {
            const id = localStorage.getItem("adminId");
            if (id && id !== "undefined" && id !== "null") {
                getCategories();
            } else {
                console.warn("Invalid or missing adminId in localStorage");
            }
        }, []);



    return (
      <CategoryContext.Provider value={{ adminData, isLogin, setIsLogin, setAdminData, loading, setLoading, catData, setCatData, getCategories }}>
        {children}
      </CategoryContext.Provider>
    );
  };

  export const useCat = () => useContext(CategoryContext);

