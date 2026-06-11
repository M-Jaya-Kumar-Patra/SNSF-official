  "use client";

  import { createContext, useContext, useState, useEffect } from "react";
  import { fetchDataFromApi } from "@/utils/api";
  import { useAuth } from "./AuthContext";

  const CategoryContext = createContext();

  export const CatProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [catData, setCatData] = useState([])
    const { adminData, isLogin } = useAuth();

    const getCategories = () => {
            setLoading(true);
            fetchDataFromApi("/api/category/getCategories")
              .then((response) => {
                setCatData(response?.data || []);
              })
              .finally(() => setLoading(false));
        }
        
    useEffect(() => {
            if (isLogin) {
                getCategories();
            } else {
                setCatData([]);
                setLoading(false);
            }
        }, [isLogin]);



    return (
      <CategoryContext.Provider value={{ adminData, isLogin, loading, setLoading, catData, setCatData, getCategories }}>
        {children}
      </CategoryContext.Provider>
    );
  };

  export const useCat = () => useContext(CategoryContext);

