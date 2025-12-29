"use client";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;
import axios from 'axios';
import Cookies from "js-cookie";

// POST request
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

    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers,
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
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return { error: true, message: error.message };
  }
};


// GET request
export const searchAPI = async (url, authRequired = false) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",

      // 🔥 Extra Tracking Headers
      "x-visitor-id": Cookies.get("visitorId") || "",
      "x-session-id": Cookies.get("sessionId") || "",
      "x-user-id": localStorage.getItem("userId") || "",   // <-- optional
    };

    // 🔐 Auth token (if required)
    if (authRequired) {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return { error: true, message: "Access token is missing or expired" };
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 🚀 Actual GET request
    const response = await fetch(apiUrl + url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}


    const data = await response.json();
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
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return { error: true, message: "Access token is missing or expired" };
      }
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "PUT",
      headers,
      credentials: "include", // optional but good
      body: updatedData, // FormData
    });

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("PUT (uploadImage) error:", error);
    return { error: true, message: error.message };
  }
};

// editData (PUT with JSON body)
export const editData = async (url, updatedData, authRequired = true) => {

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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("PUT (editData) error:", error);
    return { error: true, message: error.message };
  }
};

export const getUserAddress = async (url, userId, authRequired = true) => {
  try {
    const headers = {
      "Content-Type": "application/json", 
    };

    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      if (!token) return { error: true, message: "Access token is missing or expired" };
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return { error: true, message: error.message };
  }
};



export const deleteUserAddress = async (url, authRequired = true) => {
  try {
    const headers = {
      "Content-Type": "application/json", 
    };

    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      if (!token) return { error: true, message: "Access token is missing or expired" };
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return { error: true, message: error.message };
  }
};



export const updateUserAddress = async (url, editAddressObj, authRequired = true) => {
  try {
    const headers = {
      "Content-Type": "application/json", 
    };

    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      if (!token) return { error: true, message: "Access token is missing or expired" };
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers,
      body: JSON.stringify(editAddressObj)
    }); 

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("GET request error:", error);
    return { error: true, message: error.message };
  }
};

export const deleteItem = async (url, body) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: body, // ✅ this is how axios sends a body with DELETE
    });

    return response.data;
  } catch (error) {
    console.error("deleteItem error:", error);
    throw error;
  }
};

export const getUserEnquiries = async () => {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return { error: true, message: "Access token is missing or expired" };
    }

    const response = await axios.get(`${apiUrl}/api/enquiries/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error fetching user enquiries:", error);

    // Axios-specific error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      return {
        error: true,
        message: error.response.data?.message || "Server error",
        status: error.response.status,
      };
    }

    return { error: true, message: error.message };
  }
};


// Add this to your api.js if you don't have a FormData-compatible POST function

export const uploadVideoToCloud = async (url, formData, authRequired = true) => {
  try {
    const headers = {};

    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      if (!token) return { error: true, message: "Access token missing" };
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Note: Do NOT set "Content-Type" manually when sending FormData; 
    // the browser sets it with the boundary automatically.

    const response = await fetch(apiUrl + url, {
      method: "POST",
      headers,
      body: formData, 
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("uploadVideoToCloud error:", error);
    return { error: true, message: error.message };
  }
};