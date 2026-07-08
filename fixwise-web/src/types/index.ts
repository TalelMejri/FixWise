export interface User {
  id: string;
  fullName: string;
  email: string;
  globalRole: string;
  workspaces: Workspace[];
}

export interface Workspace {
  id: string;
  name: string;
  type: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}