import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";

const PUBLIC_UNAUTH_SCREENS = new Set<string | undefined>([
    undefined,
    "index",
    "login",
    "create-profile",
    "onboarding",
    "forgot-password",
    "reset-password",
]);

export function useProtectedRoute() {
    const { isAuth, isLoading: isAuthLoading } = useAuth();
    const { hasSeenOnboarding, isLoading: isOnboardingLoading } = useOnboarding();
    const { isLoading: isLocaleLoading } = useLocale();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isAuthLoading || isOnboardingLoading || isLocaleLoading) {
            return;
        }

        const [group, screen] = segments as unknown as string[];

        if (!hasSeenOnboarding) {
            if (screen !== "onboarding") {
                router.replace("/(unauthorized)/onboarding");
            }
            return;
        }

        const inUnauthGroup = group === "(unauthorized)";
        const isPublicScreen = inUnauthGroup && PUBLIC_UNAUTH_SCREENS.has(screen);
        const requiresAuth = group === "(authorized)" || (inUnauthGroup && !isPublicScreen);

        if (!isAuth && requiresAuth) {
            router.replace("/(unauthorized)");
        } else if (isAuth && isPublicScreen) {
            router.replace("/(authorized)");
        }
    }, [
        isAuth,
        isAuthLoading,
        hasSeenOnboarding,
        isOnboardingLoading,
        isLocaleLoading,
        segments,
        router,
    ]);
}
