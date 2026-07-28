import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";

// "qr-code" lives under the (unauthorized) route group for historical
// reasons, but requires a logged-in user (post-login, pre-check-in screen) —
// hence the explicit auth requirement below rather than deriving it purely
// from the group name. "onboarding" is genuinely public (pre-auth) —
// omitting it here caused an infinite redirect loop between that screen and
// welcome, since it would otherwise fall through to the "requires auth"
// branch below.
const PUBLIC_UNAUTH_SCREENS = new Set<string | undefined>([
    undefined,
    "index",
    "login",
    "create-profile",
    "onboarding",
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

        // The onboarding gate takes priority over auth, and must fully
        // resolve before falling through. The early `return` here (whether
        // or not a redirect fired) is load-bearing — without it, the auth
        // check below would still run while sitting on the onboarding
        // screen and bounce elsewhere, ping-ponging between screens.
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
