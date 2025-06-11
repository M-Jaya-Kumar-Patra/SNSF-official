  "use client";

  import { createContext, useContext, useState, useEffect } from "react";
  import { jwtDecode } from "jwt-decode";
  import { fetchDataFromApi } from "@/utils/api";
  import { useRouter } from "next/navigation";

  const ProductContext = createContext();

  export const PrdProvider = ({ children }) => {
    const router = useRouter()
    const [adminData, setAdminData] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);


    const [prdData, setPrdData] = useState([])


    const getProducts = async() => {
      setLoading(true)
      await fetchDataFromApi("/api/product/gaps").then((response) => {
        let productArr = [];
        console.log("useeffect",response?.data)
        if(response?.error === false){
          for(let i = 0; i < response?.data?.length; i++){
            productArr[i] = response?.data[i];
            productArr[i].checked = false
          }
        }
        setPrdData(productArr);
        setLoading(false)
      });
        }
        
    useEffect(() => {
            setLoading(true)
            const id = localStorage.getItem("adminId");
            if (id && id !== "undefined" && id !== "null") {
                getProducts();
                setLoading(false)
            } else {
                console.warn("Invalid or missing adminId in localStorage");
            }
        }, []);



    return (
      <ProductContext.Provider value={{ adminData, isLogin, setIsLogin, setAdminData, loading, setLoading, prdData, setPrdData, getProducts }}>
        {children}
      </ProductContext.Provider>
    );
  };

  export const usePrd = () => useContext(ProductContext);

