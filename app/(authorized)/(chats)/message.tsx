import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Modal,
    SafeAreaView
} from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const mockMessages = [
    { id: "1", text: "Hey, how are you?", sender: "other" },
    { id: "2", text: "I’m good! Just chilling at the café ☕", sender: "me" },
    { id: "3", text: "Nice! Which café?", sender: "other" },
    { id: "4", text: "Downtown, Macha Mate!", sender: "me" },
];

export default function MessageScreen() {
    const [messages, setMessages] = useState(mockMessages);
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(10);
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
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={90}
        >
        <SafeAreaView>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-white">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-lg font-semibold">Chat with John Doe</Text>
                </View>
            </View>

            {/* Time Remaining */}
            <View>
                <Text className="text-sm text-gray-500 text-center mt-3">
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
                            item.sender === "me" ? "bg-[#F58C26] self-end" : "bg-gray-200 self-start"
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
            <View className="flex-row items-center border-t border-gray-200 px-4 py-6 bg-white">
                <TextInput
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    editable={!showModal} // disable typing when modal shows
                />
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-full px-4 py-2"
                    onPress={sendMessage}
                    disabled={showModal}
                >
                    <Text className="text-white font-semibold">Send</Text>
                </TouchableOpacity>
            </View>

            {/* Modal when time is over */}
            <Modal
                transparent
                visible={showModal}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
                        <Text className="text-xl font-bold text-[#F58C26] mb-3">
                            ⏰ Time's up!
                        </Text>
                        <Text className="text-center text-gray-700 mb-5">
                            Your chat session has ended. It's time to move and meet face-to-face! 💫
                        </Text>
                        <TouchableOpacity
                            className="bg-[#F58C26] rounded-full px-6 py-2"
                            onPress={() => router.back()}
                        >
                            <Text className="text-white font-semibold">Got it!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
