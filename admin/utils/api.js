"use client"

// import { getTokenExpiration } from "@/lib/jwtUtils";
import axios from 'axios';


const apiUrl = process.env.NEXT_PUBLIC_API_URL


export const postData = async (url, formData, authRequired = true) => {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (authRequired) {
      const token = localStorage.getItem("accessToken")

      if (!token) throw new Error("Access token is missing or expired");
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl+url, {
      method: "POST",
      headers,
      credentials: "include", // ✅ REQUIRED
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

// GET request
export const fetchDataFromApi = async (url, authRequired = true) => {
  try {
    const headers = {
      "Content-Type": "application/json", 
      'Cache-Control': 'no-cache',
    };
    
    
    if (authRequired) {
      const token = localStorage.getItem("accessToken")
      
      if (!token) {
        return { error: true, message: "Access token is missing or expired" };
      }
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(apiUrl + url, {
      method: "GET",
      headers,
    });
    
    const data = await response.json();
    console.log("hii")    
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return { error: true, message: error.message };
  }
};

// uploadImage (PUT with FormData)
export const uploadImage = async (url, updatedData, authRequired = true) => {
  try {
    const headers = {};

    if (authRequired) {
      const token = localStorage.getItem("accessToken")

      if (!token) {
        return { error: true, message: "Access token is missing or expired" };
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "PUT",
      headers,
      body: updatedData, // FormData object
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("PUT (uploadImage) error:", error);
    return { error: true, message: error.message };
  }
};

export const uploadImages = async (url, formData, authRequired = true) => {
  try {
    const headers = {};
    
    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      
      console.log("errorrrr")
      if (!token) {
        return { error: true, message: "Access token is missing or expired" };
      }
      
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers, // No 'Content-Type' here!
      body: formData,
    });


    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("uploadImages error:", error);
    return { error: true, message: error.message };
  }
};

// editData (PUT with JSON body)
export const editData = async (url, updatedData, authRequired = true) => {
  console.log("Sending PUT request to:", apiUrl + url);

            console.log("GONEEEE")


  try {
    const token = localStorage.getItem("accessToken")

    const response = await fetch(apiUrl + url, {
      method: "PUT",
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    console.log(response.status, response.headers.get("Content-Type"));

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("PUT (editData) error:", error);
    return { error: true, message: error.message };
  }
};





export const deleteImages = async (url, imageUrl) => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        img: imageUrl, // ✅ Will be appended as ?img=...
      },  
    });

    return response.data;
  } catch (error) {
    console.error("deleteImages error:", error.response?.data || error.message);
    throw error;
  }
};


export const deleteCategory = async (url, id)=>{
  try{
    const token = localStorage.getItem("accessToken")
    
    console.log("id", id)
    const response = await axios.delete(apiUrl+url,{
      headers:{
         Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      id:{id}
      
    })

    return response.data
  }catch(error){
    console.error("deleteCategory error:",  error);
    throw error;
  }
}

export const deleteProduct = async (url, id)=>{
  try{
    const token = localStorage.getItem("accessToken")
    
    const response = await axios.delete(apiUrl+url,{
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      id:{id}
      
    })
    console.log("id", id)
    console.log("iuughfiduf")

    return response.data
  }catch(error){
    console.error("deleteCategory error:",  error);
    throw error;
  }
}

// export const deleteMultipleData = async (url, data) => {
//   try {
//     const token = localStorage.getItem("accessToken");

//     const response = await axios.delete(apiUrl + url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       data // ✅ Use 'data' for the request body in DELETE
//     });

//     return response.data;
//   } catch (error) {
//     console.error("deleteMultipleData error:", error.response?.data || error.message);
//     throw error;
//   }
// }
export const deleteMultipleData = async (url, data) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(apiUrl + url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // ✅ must be stringified
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message);
    }

    return await response.json();

  } catch (error) {
    console.error("❌ deleteMultipleData FULL ERROR:", error);
    throw error;
  }
};


export const deleteSlide = async (url, id)=>{
  try{

    const token = localStorage.getItem("accessToken")
    
    const response = await axios.delete(apiUrl+url,{
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      id:{id}
      
    })

    return response.data
  }catch(error){
    console.error("deleteSlide error:",  error);
    throw error;
  }
}
