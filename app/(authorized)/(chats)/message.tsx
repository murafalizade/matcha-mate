import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

import { ExpireModal } from "@/components/ExpireModal";
import { useAuth } from "@/hooks/useAuth";
import { useChatSession } from "@/hooks/useChatSession";

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function MessageScreen() {
    const { id: chatSessionId } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const {
        session,
        messages,
        partnerTyping,
        error,
        endedReason,
        sendMessage,
        setTyping,
        endChat,
    } = useChatSession(chatSessionId ?? null);

    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // The countdown is derived from the session's own expiresAt rather than a
    // local fixed timer — it needs to reflect the server's clock, not the
    // moment this screen happened to mount.
    useEffect(() => {
        if (!session) {
            return;
        }
        const tick = () => {
            const secondsLeft = Math.max(
                0,
                Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
            );
            setTimeLeft(secondsLeft);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [session]);

    const ended = endedReason !== null || timeLeft === 0;

    const handleChangeText = (text: string) => {
        setInput(text);
        setTyping(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
    };

    const handleSend = () => {
        if (!input.trim() || ended) {
            return;
        }
        sendMessage(input.trim());
        setInput("");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold flex-1">
                    {session
                        ? `Chat with ${session.partner.firstName} ${session.partner.lastName}`
                        : "Chat"}
                </Text>
                {!ended && (
                    <TouchableOpacity onPress={endChat}>
                        <Text className="text-red-500 font-medium">End</Text>
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="text-sm text-red-500 text-center mt-2">{error}</Text>}

            {/* Countdown */}
            {timeLeft !== null && (
                <Text className="text-sm text-gray-500 text-center mt-2 mb-1">
                    Time remaining: {formatTime(timeLeft)}
                </Text>
            )}
            {partnerTyping && !ended && (
                <Text className="text-xs text-gray-400 text-center mb-1">
                    {session?.partner.firstName} is typing…
                </Text>
            )}

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
                                    item.senderId === user?.id
                                        ? "bg-primary self-end"
                                        : "bg-gray-200 self-start"
                                }`}
                            >
                                <Text
                                    className={`${
                                        item.senderId === user?.id ? "text-white" : "text-black"
                                    } text-base`}
                                >
                                    {item.content}
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
                            onChangeText={handleChangeText}
                            editable={!ended}
                            maxLength={500}
                        />
                        <TouchableOpacity
                            className="bg-primary rounded-full px-4 py-2"
                            onPress={handleSend}
                            disabled={ended}
                        >
                            <Text className="text-white font-semibold">Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <ExpireModal showModal={ended} />
        </SafeAreaView>
    );
}
