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
    birthDate: string; // ISO date string, e.g. "1995-06-15"
    gender: Gender;
    bio: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
