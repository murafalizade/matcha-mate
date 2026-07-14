import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";

export default function SettingsScreen() {
    const { logout } = useAuth();
    const { t } = useLocale();

    return (
        <ScrollView className="flex-1 bg-cream p-6">
            <SafeAreaView>
                <Text className="text-2xl font-bold mb-6 text-center">Settings</Text>

                {/* Language */}
                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-2 font-semibold">{t.language.title}</Text>
                    <LanguagePicker />
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
                    <TouchableOpacity className="py-3" onPress={() => console.log("Privacy")}>
                        <Text className="text-lg">Privacy & Security</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    className="bg-red-500 rounded-xl py-3 mt-4"
                    onPress={() => logout()}
                >
                    <Text className="text-white text-center font-semibold text-lg">Log Out</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}
