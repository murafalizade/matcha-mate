import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";

// "qr-code" lives under the (unauthorized) route group for historical
// reasons, but requires a logged-in user (post-login, pre-check-in screen) —
// hence the explicit auth requirement below rather than deriving it purely
// from the group name. "onboarding"/"language" are
// genuinely public (pre-auth) — omitting either here caused an infinite
// redirect loop between that screen and welcome, since it would otherwise
// fall through to the "requires auth" branch below.
const PUBLIC_UNAUTH_SCREENS = new Set<string | undefined>([
    undefined,
    "index",
    "login",
    "create-profile",
    "onboarding",
    "language",
]);

export function useProtectedRoute() {
    const { isAuth, isLoading: isAuthLoading } = useAuth();
    const { hasSeenOnboarding, isLoading: isOnboardingLoading } = useOnboarding();
    const { hasChosenLanguage, isLoading: isLocaleLoading } = useLocale();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isAuthLoading || isOnboardingLoading || isLocaleLoading) {
            return;
        }

        const [group, screen] = segments as unknown as string[];

        // Language selection gates everything else — nobody should get past
        // it, even by deep-linking straight to onboarding or login. The
        // early `return` here (regardless of whether a redirect fired) is
        // load-bearing: without it, the onboarding check below would still
        // run while sitting on the language screen (hasSeenOnboarding is
        // also false on a first run) and bounce to onboarding, which would
        // then get bounced back here — an infinite ping-pong between the
        // two screens.
        if (!hasChosenLanguage) {
            if (screen !== "language") {
                router.replace("/(unauthorized)/language");
            }
            return;
        }

        // Same reasoning as above, one step later: the onboarding gate takes
        // priority over auth, and must fully resolve before falling through.
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
        hasChosenLanguage,
        isLocaleLoading,
        segments,
        router,
    ]);
}
