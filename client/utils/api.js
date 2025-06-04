"use client";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;


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

// editData (PUT with JSON body)
export const editData = async (url, updatedData, authRequired = true) => {
  console.log("Sending PUT request to:", apiUrl + url);

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

    console.log("errorrrr")
    const data = await response.json();
    console.log(data);
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
