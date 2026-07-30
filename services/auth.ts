import {
    AuthResponse,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
} from "@/services/auth.types";
import { apiPost } from "@/utils/api";

export const AuthService = {
    register(payload: RegisterPayload): Promise<AuthResponse> {
        return apiPost<AuthResponse>("/auth/register", payload);
    },

    login(payload: LoginPayload): Promise<AuthResponse> {
        return apiPost<AuthResponse>("/auth/login", payload);
    },

    forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse | null> {
        return apiPost<ForgotPasswordResponse | null>("/auth/forgot-password", payload);
    },

    resetPassword(token: string, payload: ResetPasswordPayload): Promise<void> {
        return apiPost<void>(`/auth/reset-password/${token}`, payload);
    },
};
