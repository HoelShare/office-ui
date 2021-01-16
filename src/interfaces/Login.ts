export interface LoginForm {
  username: string;
  password: string;
};

export interface LoginResponse {
  success: boolean;
  error: string | null;
};