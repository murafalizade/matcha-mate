import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import { AuthContextValue } from "@/hooks/useAuth.types";
import { AuthService } from "@/services/auth";
import { LoginPayload, RegisterPayload } from "@/services/auth.types";
import { setAccessToken, setUnauthorizedHandler } from "@/utils/api";
import { AuthUser } from "@/utils/models";
import { Storage } from "@/utils/storage";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const userRef = useRef<AuthUser | null>(null);
    userRef.current = user;

    const logout = async () => {
        setAccessToken(null);
        await Storage.clear();
        setUser(null);
    };

    useEffect(() => {
        setUnauthorizedHandler(() => {
            // Access tokens aren't refreshed (see MOBILE_INTEGRATION_GUIDE.md §1,
            // Option C) — any 401 means the session is gone, so log out.
            if (userRef.current) {
                void logout();
            }
        });

        (async () => {
            const [token, storedUser] = await Promise.all([
                Storage.getAccessToken(),
                Storage.getUser(),
            ]);
            if (token && storedUser) {
                setAccessToken(token);
                setUser(storedUser);
            }
            setIsLoading(false);
        })();

        return () => setUnauthorizedHandler(null);
    }, []);

    const persistSession = async (accessToken: string, authUser: AuthUser) => {
        setAccessToken(accessToken);
        await Promise.all([Storage.setAccessToken(accessToken), Storage.setUser(authUser)]);
        setUser(authUser);
    };

    const login = async (payload: LoginPayload) => {
        const { accessToken, user: authUser } = await AuthService.login(payload);
        await persistSession(accessToken, authUser);
    };

    const register = async (payload: RegisterPayload) => {
        const { accessToken, user: authUser } = await AuthService.register(payload);
        await persistSession(accessToken, authUser);
    };

    return (
        <AuthContext.Provider value={{ user, isAuth: !!user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
