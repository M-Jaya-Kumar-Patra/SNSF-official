// lib/jwtUtils.js
import jwtDecode from "jwt-decode";

export function getTokenExpiration(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 3600000; // in milliseconds
  } catch (error) {
    return null;
  }
}
