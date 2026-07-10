import { AuthResponse, LoginPayload, RegisterPayload } from "@/services/auth.types";
import { apiPost } from "@/utils/api";

export const AuthService = {
    register(payload: RegisterPayload): Promise<AuthResponse> {
        return apiPost<AuthResponse>("/auth/register", payload);
    },

    login(payload: LoginPayload): Promise<AuthResponse> {
        return apiPost<AuthResponse>("/auth/login", payload);
    },
};
