import { router } from "expo-router";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { ExpireModalProps } from "@/components/ExpireModal/types";

export const ExpireModal = ({ showModal }: ExpireModalProps) => {
    return (
        <Modal transparent visible={showModal} animationType="fade" onRequestClose={() => {}}>
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
                    <Text className="text-xl font-bold text-primary mb-3">⏰ Time’s up!</Text>
                    <Text className="text-center text-muted mb-5">
                        Your chat session has ended. It’s time to move and meet face-to-face! 💫
                    </Text>
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
