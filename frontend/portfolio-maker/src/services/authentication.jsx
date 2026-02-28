import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-builder-7i56.onrender.com";

function parseApiError(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData && typeof responseData === "object") {
    const [firstValue] = Object.values(responseData);
    if (Array.isArray(firstValue)) {
      return firstValue[0];
    }
    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return error?.message || fallbackMessage;
}

export async function register(userData) {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
    };
    const response = await axios.post(`${API_URL}/accounts/register/`, payload);
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Registration failed."));
  }
}

export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/accounts/login/`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Login failed."));
  }
}

// Get current authenticated user
export async function getUser(tokenOverride) {
  try {
    const token = tokenOverride || localStorage.getItem("token");
    if (!token) {
      return null;
    }

    const response = await axios.get(`${API_URL}/accounts/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch {
    return null;
  }
}

export async function getPublicUser(userId) {
  try {
    const response = await axios.get(`${API_URL}/accounts/public/${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Failed to load user profile."));
  }
}
