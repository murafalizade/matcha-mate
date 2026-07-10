import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

// "launch" and "qr-code" live under the (unauthorized) route group for
// historical reasons, but both require a logged-in user (post-login,
// pre-check-in screens) — hence the explicit auth requirement below rather
// than deriving it purely from the group name. "onboarding" is genuinely
// public (pre-auth) — omitting it here caused an infinite redirect loop
// between onboarding and welcome, since it would otherwise fall through to
// the "requires auth" branch below.
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
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isAuthLoading || isOnboardingLoading) {
            return;
        }

        const [group, screen] = segments as unknown as string[];

        // The onboarding gate takes priority over everything else — nobody
        // should be able to navigate past it on a first run.
        if (!hasSeenOnboarding && screen !== "onboarding") {
            router.replace("/(unauthorized)/onboarding");
            return;
        }

        const inUnauthGroup = group === "(unauthorized)";
        const isPublicScreen = inUnauthGroup && PUBLIC_UNAUTH_SCREENS.has(screen);
        const requiresAuth = group === "(authorized)" || (inUnauthGroup && !isPublicScreen);

        if (!isAuth && requiresAuth) {
            router.replace("/(unauthorized)");
        } else if (isAuth && isPublicScreen) {
            router.replace("/(unauthorized)/launch");
        }
    }, [isAuth, isAuthLoading, hasSeenOnboarding, isOnboardingLoading, segments, router]);
}
