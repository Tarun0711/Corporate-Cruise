import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

class UserStatusService {
  static async updateUserStatus(userId, status, token) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async updateRoutingStatus(userId, status, token) {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}/routing`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getUserStatus(userId, token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getUsersByStatus(params, token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/getUserByStatus`, {
        params: { status: params },
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  static async getRoutingUsers(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/routing`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}

export default UserStatusService;