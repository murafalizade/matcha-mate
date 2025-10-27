import {Modal, Text, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";

interface Props {
    showModal: boolean;
}

export const ExpireModal = ({showModal}: Props) => {

    return (
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
    )
}
