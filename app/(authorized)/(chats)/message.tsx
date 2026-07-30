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
import { INK, MUTED } from "@/constants/colors";
import { useAuth } from "@/hooks/useAuth";
import { useChatSession } from "@/hooks/useChatSession";
import { formatCountdown } from "@/utils/format";

const TYPING_TIMEOUT_MS = 1500;
const COUNTDOWN_TICK_MS = 1000;
const KEYBOARD_VERTICAL_OFFSET = 80;
const MESSAGE_LIST_PADDING_HORIZONTAL = 16;
const MESSAGE_LIST_PADDING_BOTTOM = 12;
const MESSAGE_MAX_LENGTH = 500;

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

    useEffect(() => {
        if (!session?.expiresAt) {
            setTimeLeft(null);
            return;
        }
        const expiresAt = session.expiresAt;
        const tick = () => {
            const secondsLeft = Math.max(
                0,
                Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
            );
            setTimeLeft(secondsLeft);
        };
        tick();
        const interval = setInterval(tick, COUNTDOWN_TICK_MS);
        return () => clearInterval(interval);
    }, [session]);

    const ended = endedReason !== null || timeLeft === 0;

    const handleChangeText = (text: string) => {
        setInput(text);
        setTyping(true);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setTyping(false), TYPING_TIMEOUT_MS);
    };

    const handleSend = () => {
        if (!input.trim() || ended) {
            return;
        }
        sendMessage(input.trim());
        setInput("");
    };

    return (
        <SafeAreaView className="flex-1 bg-cream">
            <View className="flex-row items-center px-4 py-3 border-b border-dot/40">
                <TouchableOpacity
                    onPress={() => router.push("/(authorized)/(chats)")}
                    className="mr-3"
                >
                    <Ionicons name="arrow-back" size={24} color={INK} />
                </TouchableOpacity>
                <Text className="text-lg font-semibold flex-1 text-ink">
                    {session
                        ? `Chat with ${session.partner.firstName} ${session.partner.lastName}`
                        : "Chat"}
                </Text>
                {!ended && session?.expiresAt && (
                    <TouchableOpacity onPress={endChat}>
                        <Text className="text-red-500 font-medium">End</Text>
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text className="text-sm text-red-500 text-center mt-2">{error}</Text>}

            {!ended &&
                session &&
                (timeLeft !== null ? (
                    <Text className="text-sm text-muted text-center mt-2 mb-1">
                        Time remaining: {formatCountdown(timeLeft)}
                    </Text>
                ) : (
                    <Text className="text-sm text-muted text-center mt-2 mb-1">
                        Say hi to start your 10-minute chat!
                    </Text>
                ))}
            {partnerTyping && !ended && (
                <Text className="text-xs text-muted text-center mb-1">
                    {session?.partner.firstName} is typing…
                </Text>
            )}

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
            >
                <View className="flex-1 justify-between mt-3">
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: MESSAGE_LIST_PADDING_HORIZONTAL,
                            paddingBottom: MESSAGE_LIST_PADDING_BOTTOM,
                        }}
                        renderItem={({ item }) => (
                            <View
                                className={`mb-3 max-w-[75%] px-4 py-2 rounded-xl ${
                                    item.senderId === user?.id
                                        ? "bg-primary self-end"
                                        : "bg-white self-start border border-dot/40"
                                }`}
                            >
                                <Text
                                    className={`${
                                        item.senderId === user?.id ? "text-white" : "text-ink"
                                    } text-base`}
                                >
                                    {item.content}
                                </Text>
                            </View>
                        )}
                    />

                    <View className="flex-row items-center border-t border-dot/40 px-4 py-4 bg-white mb-0">
                        <TextInput
                            className="flex-1 border border-dot rounded-full px-4 py-2 mr-2 bg-panel text-ink"
                            placeholder="Type a message..."
                            placeholderTextColor={MUTED}
                            value={input}
                            onChangeText={handleChangeText}
                            editable={!ended}
                            maxLength={MESSAGE_MAX_LENGTH}
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
