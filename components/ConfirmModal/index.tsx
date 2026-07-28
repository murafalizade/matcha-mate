import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";

import { ConfirmModalProps } from "@/components/ConfirmModal/types";

export const ConfirmModal = ({
    visible,
    title,
    message,
    confirmLabel,
    cancelLabel = "Cancel",
    destructive = false,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View className="flex-1 justify-center items-center bg-black/40 px-8">
                <View
                    className="bg-white rounded-2xl p-6 w-full"
                    style={{
                        shadowColor: "#4A2C2A",
                        shadowOpacity: 0.15,
                        shadowRadius: 30,
                        shadowOffset: { width: 0, height: 10 },
                    }}
                >
                    <Text className="text-xl font-bold text-ink mb-2">{title}</Text>
                    <Text className="text-muted mb-6">{message}</Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 border border-dot rounded-full py-3 items-center"
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text className="text-ink font-semibold">{cancelLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 rounded-full py-3 items-center ${
                                destructive ? "bg-red-500" : "bg-primary"
                            }`}
                            onPress={onConfirm}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold">{confirmLabel}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
