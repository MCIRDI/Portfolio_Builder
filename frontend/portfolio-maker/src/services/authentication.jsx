import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const register = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/register/`,
      userData,
    );

    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}/accounts/login/`,
      credentials,
    );
    localStorage.setItem("token", response.data.token);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get current authenticated user
export async function getUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await axios.get(`${API_URL}/accounts/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
