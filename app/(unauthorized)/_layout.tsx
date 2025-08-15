import {Stack} from "expo-router";

export default function UnAuthorizedLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="qr-code" options={{headerShown: true, title: "QR Code"}} />
            <Stack.Screen name="create-profile" options={{headerShown: true, title: "Profile"}} />
            <Stack.Screen name="set-preferences" options={{headerShown: true, title: "Preferences"}} />
        </Stack>
    )
}