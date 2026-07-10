import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

// "launch" and "qr-code" live under the (unauthorized) route group for
// historical reasons, but both require a logged-in user (post-login,
// pre-check-in screens) — hence the explicit auth requirement below rather
// than deriving it purely from the group name.
const PUBLIC_UNAUTH_SCREENS = new Set<string | undefined>([
    undefined,
    "index",
    "login",
    "create-profile",
]);

export function useProtectedRoute() {
    const { isAuth, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        const [group, screen] = segments as unknown as string[];
        const inUnauthGroup = group === "(unauthorized)";
        const isPublicScreen = inUnauthGroup && PUBLIC_UNAUTH_SCREENS.has(screen);
        const requiresAuth = group === "(authorized)" || (inUnauthGroup && !isPublicScreen);

        if (!isAuth && requiresAuth) {
            router.replace("/(unauthorized)");
        } else if (isAuth && isPublicScreen) {
            router.replace("/(unauthorized)/launch");
        }
    }, [isAuth, isLoading, segments, router]);
}
