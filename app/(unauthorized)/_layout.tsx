import { Stack } from "expo-router";

export default function UnAuthorizedLayout() {
    return (
        <Stack>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="qr-code" options={{ headerShown: false }} />
            <Stack.Screen name="create-profile" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}
