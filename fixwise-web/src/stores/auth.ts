import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthService } from '@/services/auth.service';
import { apiService } from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.globalRole === 'Admin');

  function setAuthData(data: { token: string; user: User }): void {
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('token', data.token);
    apiService.setAuthToken(data.token);
  }

  function clearAuthData(): void {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    apiService.removeAuthToken();
  }

  async function login(loginData: LoginRequest): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await AuthService.login(loginData);
      setAuthData({ token: response.token, user: response.user });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(registerData: RegisterRequest): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await AuthService.register(registerData);
      setAuthData({ token: response.token, user: response.user });
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur d'inscription";
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const userData = await AuthService.getCurrentUser();
      user.value = userData;
    } catch (err) {
      // Si le token est invalide, on déconnecte l'utilisateur
      if (err instanceof Error && err.message.includes('401')) {
        logout();
      }
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function logout(): void {
    clearAuthData();
    // Redirection vers login (gérée par le router)
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchCurrentUser,
    logout,
    clearAuthData,
  };
});