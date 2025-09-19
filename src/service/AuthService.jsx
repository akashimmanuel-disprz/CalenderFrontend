import axios from "axios";

const API_URL = "http://localhost:5083/api/User"; // Your backend URL

const AuthService = {
  // Login function
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data)); // store token/info
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Register function
  register: async ({ username, email, password, role }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
        role,
      });

      if (response.status === 201 || response.data.success) {
        return { success: true, message: "Registration successful" };
      }

      return { success: false, message: response.data.message || "Registration failed" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem("user");
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("user");
  },
};

export default AuthService;
