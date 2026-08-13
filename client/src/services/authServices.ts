import api from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserResponse,
} from "../types/auth";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (
  data: RegisterRequest,
): Promise<LoginResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const getMe = async (): Promise<UserResponse> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<UserResponse> => {
  const response = await api.put("/auth/profile", data);
  return response.data;
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put("/auth/password", data);
  return response.data;
};
