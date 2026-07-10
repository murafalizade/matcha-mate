import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { RootLayoutNav } from "@/components/RootLayoutNav";
import { AuthProvider } from "@/hooks/useAuth";
import { VenueProvider } from "@/hooks/useVenue";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        FontAwesome.loadFont();
    }, []);

    useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <VenueProvider>
                <RootLayoutNav />
            </VenueProvider>
        </AuthProvider>
    );
}
