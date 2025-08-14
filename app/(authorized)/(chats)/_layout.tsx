import {Stack} from "expo-router";

export default function ChatLayout(){
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="message" options={{headerShown: true, title: "Message"}} />
        </Stack>
    )
}