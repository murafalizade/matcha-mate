import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ExpireModal } from "@/components/ExpireModal";

const mockMessages = [
    { id: "1", text: "Hey, how are you?", sender: "other" },
    { id: "2", text: "I’m good! Just chilling at the café ☕", sender: "me" },
    { id: "3", text: "Nice! Which café?", sender: "other" },
    { id: "4", text: "Downtown, Macha Mate!", sender: "me" },
];

export default function MessageScreen() {
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(100);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            setShowModal(true);
            return;
        }
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
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Chat with John Doe</Text>
            </View>

            {/* Countdown */}
            <Text className="text-sm text-gray-500 text-center mt-2 mb-1">
                Time remaining: {formatTime(timeLeft)}
            </Text>

            {/* Messages + Input container */}
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            >
                <View className="flex-1 justify-between mt-3">
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
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
                    <View className="flex-row items-center border-t border-gray-200 px-4 py-4 bg-white mb-0">
                        <TextInput
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
                            placeholder="Type a message..."
                            value={input}
                            onChangeText={setInput}
                            editable={!showModal}
                        />
                        <TouchableOpacity
                            className="bg-[#F58C26] rounded-full px-4 py-2"
                            onPress={sendMessage}
                            disabled={showModal}
                        >
                            <Text className="text-white font-semibold">Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <ExpireModal showModal={showModal} />
        </SafeAreaView>
    );
}
