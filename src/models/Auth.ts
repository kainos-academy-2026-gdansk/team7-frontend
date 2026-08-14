export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

export type RegisterResponse = AuthUser;

export interface LoginResponse {
  token: string;
  user: AuthUser;
}
