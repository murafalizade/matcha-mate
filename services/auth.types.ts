import { AuthUser, Gender } from "@/utils/models";

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
    gender: Gender;
    bio: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ForgotPasswordResponse {
    resetToken?: string;
}

export interface ResetPasswordPayload {
    newPassword: string;
}
