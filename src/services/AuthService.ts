import type { AxiosInstance } from "axios";
import type { LoginDto } from "../Dto/LoginDto";
import type { RegisterDto } from "../Dto/RegisterDto";
import type { LoginResponse, RegisterResponse } from "../models/Auth";

export class AuthService {
  constructor(private readonly apiClient: AxiosInstance) {}

  async register(credentials: RegisterDto): Promise<RegisterResponse> {
    const response = await this.apiClient.post<RegisterResponse>("/api/auth/register", credentials);

    return response.data;
  }

  async login(credentials: LoginDto): Promise<LoginResponse> {
    const response = await this.apiClient.post<LoginResponse>("/api/auth/login", credentials);

    return response.data;
  }
}
