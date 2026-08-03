import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { ChatEndKind, ExpireModalProps } from "@/components/ExpireModal/types";

const CONTENT: Record<ChatEndKind, { title: string; body: string }> = {
    expired: {
        title: "⏰ Time’s up!",
        body: "Your chat session has ended. It’s time to move and meet face-to-face! 💫",
    },
    "you-ended": {
        title: "Chat ended",
        body: "You ended this chat.",
    },
    "partner-ended": {
        title: "Chat ended",
        body: "Your chat partner ended this conversation.",
    },
    "partner-left": {
        title: "Chat ended",
        body: "Your chat partner left the venue, so this conversation has ended.",
    },
};

export const ExpireModal = ({ showModal, kind }: ExpireModalProps) => {
    const { title, body } = CONTENT[kind];

    return (
        <Modal transparent visible={showModal} animationType="fade" onRequestClose={() => {}}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
                    <Text className="text-xl font-bold text-primary mb-3">{title}</Text>
                    <Text className="text-center text-muted mb-5">{body}</Text>
                    <TouchableOpacity
                        className="bg-primary rounded-full px-6 py-2"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-semibold">Got it!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
