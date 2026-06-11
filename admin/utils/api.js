"use client";

import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PUBLIC_ADMIN_ENDPOINTS = [
  "/api/admin/login",
  "/api/admin/register",
  "/api/admin/forgot-password",
  "/api/admin/reset-password",
  "/api/user/resendOTP",
];

const isPublicEndpoint = (url) =>
  PUBLIC_ADMIN_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));

const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem("accessToken");

const buildHeaders = ({ isFormData = false, authRequired = true, url = "" }) => {
  const token = getToken();
  const headers = {};

  if (!isFormData) headers["Content-Type"] = "application/json";

  const shouldAttachToken = !isPublicEndpoint(url) && (authRequired || token);

  if (shouldAttachToken) {
    if (!token && authRequired) {
      throw new Error("Access token is missing or expired");
    }
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    return {
      error: true,
      success: false,
      status: response.status,
      message: data?.message || "Request failed",
      data,
    };
  }

  return data;
};

const request = async (
  method,
  url,
  body,
  { authRequired = true, isFormData = false } = {},
) => {
  try {
    const response = await fetch(apiUrl + url, {
      method,
      headers: buildHeaders({ isFormData, authRequired, url }),
      credentials: "include",
      body:
        body === undefined
          ? undefined
          : isFormData
          ? body
          : JSON.stringify(body),
    });

    return await parseResponse(response);
  } catch (error) {
    return {
      error: true,
      success: false,
      message: error?.message || "Network request failed",
    };
  }
};

export const postData = (url, formData, authRequired = true) =>
  request("POST", url, formData, { authRequired });

export const putData = (url, formData, authRequired = true) =>
  request("PUT", url, formData, { authRequired });

export const putImage = (url, formData, authRequired = true) =>
  request("PUT", url, formData, { authRequired, isFormData: true });

export const fetchDataFromApi = (url, authRequired = true) =>
  request("GET", url, undefined, { authRequired });

export const uploadImage = (url, updatedData, authRequired = true) =>
  request("PUT", url, updatedData, { authRequired, isFormData: true });

export const uploadImages = (url, formData, authRequired = true) =>
  request("POST", url, formData, { authRequired, isFormData: true });

export const editData = (url, updatedData, authRequired = true) =>
  request("PUT", url, updatedData, { authRequired });

export const deleteImages = async (url, imageUrl) => {
  const token = getToken();

  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      params: imageUrl ? { img: imageUrl } : undefined,
    });

    return response.data;
  } catch (error) {
    return {
      error: true,
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const deleteCategory = (url, id) =>
  request("DELETE", url, id ? { id } : undefined, { authRequired: true });

export const deleteProduct = (url, id) =>
  request("DELETE", url, id ? { id } : undefined, { authRequired: true });

export const deleteData = (url) =>
  request("DELETE", url, undefined, { authRequired: true });

export const deleteMultipleData = (url, data) =>
  request("DELETE", url, data, { authRequired: true });

export const deleteSlide = (url, id) =>
  request("DELETE", url, id ? { id } : undefined, { authRequired: true });
