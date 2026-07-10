import { LoginPayload, RegisterPayload } from "@/services/auth.types";
import { AuthUser } from "@/utils/models";

export interface AuthContextValue {
    user: AuthUser | null;
    isAuth: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
}
