import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function LaunchScreen() {
    const { user: authUser } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);

    // The backend has no "list nearby venues" endpoint — check-in is QR-driven
    // only (see PROJECT_OVERVIEW.md §5) — so this stays illustrative until
    // there's a real endpoint to back it.
    const availableLocations = [
        { id: "1", name: "Downtown Café" },
        { id: "2", name: "Sunrise Coffee" },
        { id: "3", name: "Brew & Co." },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
                {/* Top Profile */}
                <View className="flex-row items-center mb-8">
                    <Image
                        source={
                            authUser?.profileImageUrl
                                ? { uri: authUser.profileImageUrl }
                                : require("../../assets/images/test.jpeg")
                        }
                        className="w-16 h-16 rounded-full mr-4 shadow"
                    />
                    <View>
                        <Text className="text-gray-500 text-lg">Welcome back,</Text>
                        <Text className="text-2xl font-bold text-gray-800">
                            {authUser ? `${authUser.firstName} ${authUser.lastName}` : ""}
                        </Text>
                    </View>
                </View>

                {/* Main QR CTA */}
                <View className="flex-1 items-center mb-10">
                    <Text className="text-3xl font-bold mb-4 text-center text-gray-800">
                        Ready to Connect?
                    </Text>
                    <Text className="text-center text-gray-500 text-base mb-6 px-4">
                        Scan the QR code at your favorite coffee shop and start meeting people
                        around you instantly!
                    </Text>

                    <TouchableOpacity
                        className="bg-[#F58C26] rounded-2xl flex-row items-center px-8 py-5 shadow-lg"
                        onPress={() => router.push("/(unauthorized)/qr-code")}
                    >
                        <FontAwesome size={24} style={{ marginRight: 10 }} name="qrcode" />
                        <Text className="text-black text-lg font-semibold">Scan QR Code</Text>
                    </TouchableOpacity>
                </View>

                {/* Clickable Available Locations */}
                <TouchableOpacity className="mb-4" onPress={() => setModalVisible(true)}>
                    <Text className="text-[#F58C26] text-center font-semibold text-lg underline">
                        See Available Coffee Shops
                    </Text>
                </TouchableOpacity>

                {/* Modal / Drawer */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View className="flex-1 justify-end bg-black/30">
                        <View className="bg-white rounded-t-3xl p-6 max-h-[50%]">
                            <Text className="text-gray-800 font-bold text-xl mb-4">
                                Nearby Coffee Shops
                            </Text>
                            <FlatList
                                data={availableLocations}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className="py-3 border-b border-gray-200"
                                        onPress={() => console.log(`Selected ${item.name}`)}
                                    >
                                        <Text className="text-gray-800 text-lg">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                className="mt-4 py-3 bg-gray-100 rounded-xl items-center"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-gray-700 font-semibold text-lg">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
