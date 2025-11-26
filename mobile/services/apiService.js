import Constants from 'expo-constants';

// Garantir que a URL seja sempre a do Render no APK
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || Constants.manifest?.extra?.apiUrl || 'https://brunao.onrender.com/api';

console.log('API_BASE_URL configurada:', API_BASE_URL);

class ApiService {
  constructor() {
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('API Request:', url);
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Adicionar token de autenticação se disponível
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }

      const response = await fetch(url, {
        headers,
        timeout: 30000,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error.message);
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
