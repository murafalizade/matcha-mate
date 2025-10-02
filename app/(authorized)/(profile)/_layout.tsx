import {Stack} from "expo-router";

export default function ProfileLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Profile", headerShown: true , headerTitleAlign: "center" }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="edit" options={{ headerShown: false }} />
        </Stack>
    )
}
