import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function RootScreen() {
    const { isAuth } = useAuth();
    const { hasSeenOnboarding } = useOnboarding();

    if (!hasSeenOnboarding) {
        return <Redirect href="/(unauthorized)/onboarding" />;
    }
    if (isAuth) {
        return <Redirect href="/(unauthorized)/launch" />;
    }
    return <Redirect href="/(unauthorized)" />;
}
