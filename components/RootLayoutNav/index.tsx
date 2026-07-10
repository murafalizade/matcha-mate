import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isLoading: isAuthLoading } = useAuth();
    const { isLoading: isOnboardingLoading } = useOnboarding();
    const { isLoading: isLocaleLoading } = useLocale();
    const isLoading = isAuthLoading || isOnboardingLoading || isLocaleLoading;
    useProtectedRoute();

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}
