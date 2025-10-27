import {Stack} from "expo-router";

export default function UnAuthorizedLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="launch" options={{headerShown: false}} />
            <Stack.Screen name="qr-code" options={{headerShown: true, title: "QR Code", headerBackVisible: false}} />
            <Stack.Screen name="create-profile" options={{headerShown: true, title: "Profile", headerBackVisible: false}} />
            <Stack.Screen name="login" options={{headerShown: true, title: "Login", headerBackVisible: false}} />
        </Stack>
    )
}
