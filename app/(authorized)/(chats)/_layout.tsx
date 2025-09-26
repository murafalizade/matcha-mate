import {Stack} from "expo-router";

export default function ChatLayout(){
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Chats", headerShown: true , headerTitleAlign: "center" }} />
            <Stack.Screen name="message" options={{ headerShown: false }} />
        </Stack>
    )
}
