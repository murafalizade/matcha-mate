import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // expo icons

const mockMessages = [
    { id: "1", text: "Hey, how are you?", sender: "other" },
    { id: "2", text: "I’m good! Just chilling at the café ☕", sender: "me" },
    { id: "3", text: "Nice! Which café?", sender: "other" },
    { id: "4", text: "Downtown, Macha Mate!", sender: "me" },
];

export default function MessageScreen() {
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds

    // Countdown effect
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), text: input, sender: "me" },
        ]);
        setInput("");
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={90}
        >
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-lg font-semibold">John Doe</Text>
                </View>
            </View>
            <View>
                <Text className="text-sm text-gray-500">
                    Time remaining: {formatTime(timeLeft)}
                </Text>
            </View>
            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <View
                        className={`mb-3 max-w-[75%] px-4 py-2 rounded-xl ${
                            item.sender === "me"
                                ? "bg-[#F58C26] self-end"
                                : "bg-gray-200 self-start"
                        }`}
                    >
                        <Text
                            className={`${
                                item.sender === "me" ? "text-white" : "text-black"
                            } text-base`}
                        >
                            {item.text}
                        </Text>
                    </View>
                )}
            />

            {/* Input Bar */}
            <View className="flex-row items-center border-t border-gray-200 px-4 py-3 bg-white">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-full px-4 py-2"
                    onPress={sendMessage}
                >
                    <Text className="text-white font-semibold">Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
