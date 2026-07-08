import api from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export class AuthService {
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  }

  static async logout(): Promise<void> {
    // Nettoyage local
    localStorage.removeItem('token');
  }
}