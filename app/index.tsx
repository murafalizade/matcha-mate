import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function RootScreen() {
    const { isAuth } = useAuth();
    const { hasSeenOnboarding } = useOnboarding();
    const { hasChosenLanguage } = useLocale();

    if (!hasChosenLanguage) {
        return <Redirect href="/(unauthorized)/language" />;
    }
    if (!hasSeenOnboarding) {
        return <Redirect href="/(unauthorized)/onboarding" />;
    }
    if (isAuth) {
        return <Redirect href="/(unauthorized)/launch" />;
    }
    return <Redirect href="/(unauthorized)" />;
}
