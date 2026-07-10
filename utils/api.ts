import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { ApiEnvelope, FieldError } from "@/utils/api.types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
    statusCode: number;
    errors?: FieldError[];

    constructor(message: string, statusCode: number, errors?: FieldError[]) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

export const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    timeout: 15000,
});

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null) {
    accessToken = token;
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
    onUnauthorized = handler;
}

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    // Deliberately returns the unwrapped `data` payload instead of an AxiosResponse —
    // apiGet/apiPost/etc. above cast the result back to the caller's expected type.
    (response): any => {
        const envelope = response.data as ApiEnvelope<unknown>;
        // Paginated responses carry metadata alongside `data` — keep the shape, unwrap otherwise.
        if (envelope && typeof envelope === "object" && "pagination" in envelope) {
            return { ...(envelope.data as object), pagination: envelope.pagination };
        }
        return envelope?.data;
    },
    (error: AxiosError<ApiEnvelope<unknown>>) => {
        if (error.response?.status === 401) {
            onUnauthorized?.();
        }

        const envelope = error.response?.data;
        const message = envelope?.message ?? error.message ?? "Something went wrong";
        const statusCode = error.response?.status ?? 0;
        return Promise.reject(new ApiError(message, statusCode, envelope?.errors));
    },
);

// The response interceptor above unwraps the `{ data }` envelope, so the
// resolved value is already `T`, not an AxiosResponse<T> — these helpers
// give call sites the correct static type instead of every caller casting.
export function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.get(url, config) as unknown as Promise<T>;
}

export function apiPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return api.post(url, data, config) as unknown as Promise<T>;
}

export function apiPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return api.patch(url, data, config) as unknown as Promise<T>;
}

export function apiPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return api.put(url, data, config) as unknown as Promise<T>;
}

export function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete(url, config) as unknown as Promise<T>;
}
