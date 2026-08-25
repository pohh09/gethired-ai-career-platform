export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  role?: "user" | "admin";
  createdAt?: string;
  lastLoginAt?: string;
  loginCount?: number;
  lastActiveAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface UserResponse {
  success: boolean;
  message?: string;
  user: User;
}
