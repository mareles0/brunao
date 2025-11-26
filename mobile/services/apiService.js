import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.100.36:3001/api';

class ApiService {
  constructor() {
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  async request(endpoint, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Adicionar token de autenticação se disponível
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  getAllSpaces() {
    return this.request('/spaces');
  }

  getAllVehicles() {
    return this.request('/vehicles');
  }

  parkVehicle(plate, spaceId) {
    return this.request('/sessions/park', {
      method: 'POST',
      body: JSON.stringify({ plate, spaceId }),
    });
  }

  unparkVehicle(plate) {
    return this.request(`/sessions/unpark/${plate}`, {
      method: 'POST',
    });
  }

  getMySessions() {
    return this.request('/sessions/my-sessions');
  }

  getStatistics() {
    return this.request('/parking/statistics');
  }
}

export default new ApiService();
