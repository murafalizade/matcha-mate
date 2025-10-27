import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";

export default function SettingsScreen() {
    return (
        <ScrollView className="flex-1 bg-white p-6">
            <SafeAreaView>
            <Text className="text-2xl font-bold mb-6 text-center">Settings</Text>

            {/* Account Section */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-2 font-semibold">Account</Text>
                <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => router.push("/(authorized)/settings/change-email")}
                >
                    <Text className="text-lg">Change Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => router.push("/(authorized)/settings/change-password")}
                >
                    <Text className="text-lg">Change Password</Text>
                </TouchableOpacity>
            </View>

            {/* App Section */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-2 font-semibold">App</Text>
                <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => console.log("Notifications")}
                >
                    <Text className="text-lg">Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="py-3"
                    onPress={() => console.log("Privacy")}
                >
                    <Text className="text-lg">Privacy & Security</Text>
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity
                className="bg-red-500 rounded-xl py-3 mt-4"
                onPress={() => console.log("Logout")}
            >
                <Text className="text-white text-center font-semibold text-lg">
                    Log Out
                </Text>
            </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}
