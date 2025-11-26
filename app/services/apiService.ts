import { API_CONFIG } from '../constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na requisição');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro desconhecido ao conectar com a API');
    }
  }

  async getAllSpaces() {
    return this.request('/spaces');
  }

  async getFreeSpaces() {
    return this.request('/spaces/free');
  }

  async getOccupiedSpaces() {
    return this.request('/spaces/occupied');
  }

  async getSpaceById(id: string) {
    return this.request(`/spaces/${id}`);
  }

  async getAllVehicles() {
    return this.request('/vehicles');
  }

  async getVehicleByPlate(plate: string) {
    return this.request(`/vehicles/${plate}`);
  }

  async parkVehicle(plate: string, spaceId: string) {
    return this.request('/vehicles/park', {
      method: 'POST',
      body: JSON.stringify({ plate, spaceId }),
    });
  }

  async unparkVehicle(plate: string) {
    return this.request(`/vehicles/${plate}/unpark`, {
      method: 'POST',
    });
  }

  async getVehicleHistory() {
    return this.request('/vehicles/history');
  }

  async getStatistics() {
    return this.request('/parking/statistics');
  }

  async getRecentEntries(limit: number = 5) {
    return this.request(`/parking/recent-entries?limit=${limit}`);
  }

  async findNextFreeSpace() {
    return this.request('/parking/next-free-space');
  }
}

export default new ApiService();
