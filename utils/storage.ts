import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { AuthUser } from "@/utils/models";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";

// expo-secure-store has no web implementation (no Keychain/Keystore
// equivalent there) — fall back to localStorage on web, Keychain/Keystore
// on native.
const kv =
    Platform.OS === "web"
        ? {
              getItemAsync: (key: string) =>
                  Promise.resolve(globalThis.localStorage?.getItem(key) ?? null),
              setItemAsync: (key: string, value: string) =>
                  Promise.resolve(globalThis.localStorage?.setItem(key, value)),
              deleteItemAsync: (key: string) =>
                  Promise.resolve(globalThis.localStorage?.removeItem(key)),
          }
        : SecureStore;

export const Storage = {
    getAccessToken(): Promise<string | null> {
        return kv.getItemAsync(ACCESS_TOKEN_KEY);
    },

    async setAccessToken(token: string): Promise<void> {
        await kv.setItemAsync(ACCESS_TOKEN_KEY, token);
    },

    async removeAccessToken(): Promise<void> {
        await kv.deleteItemAsync(ACCESS_TOKEN_KEY);
    },

    async getUser(): Promise<AuthUser | null> {
        const raw = await kv.getItemAsync(USER_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    },

    async setUser(user: AuthUser): Promise<void> {
        await kv.setItemAsync(USER_KEY, JSON.stringify(user));
    },

    async removeUser(): Promise<void> {
        await kv.deleteItemAsync(USER_KEY);
    },

    async clear(): Promise<void> {
        await Promise.all([this.removeAccessToken(), this.removeUser()]);
    },
};
