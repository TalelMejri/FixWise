import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { ApiError } from '@/types';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Intercepteur pour gérer les erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          // Erreur du serveur
          console.error('API Error:', error.response.data);
          throw new Error(error.response.data?.message || 'Une erreur est survenue');
        } else if (error.request) {
          // Pas de réponse du serveur
          console.error('Network Error:', error.request);
          throw new Error('Impossible de contacter le serveur');
        } else {
          // Erreur de configuration
          console.error('Request Error:', error.message);
          throw new Error('Erreur de requête');
        }
      }
    );
  }

  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }

  public setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }

  public removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

export const apiService = new ApiService();
export default apiService.getAxiosInstance();