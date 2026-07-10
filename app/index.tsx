import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function RootScreen() {
    const { isAuth } = useAuth();

    if (isAuth) {
        return <Redirect href="/(unauthorized)/launch" />;
    }
    return <Redirect href="/(unauthorized)" />;
}
