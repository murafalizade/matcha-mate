import { DevSettings, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { Storage } from "@/utils/storage";

export default function SettingsScreen() {
    const { logout } = useAuth();
    const { t } = useLocale();

    const handleResetAppData = async () => {
        await Storage.resetAll();
        // Session/onboarding state is only read once at boot (in the
        // Auth/Onboarding providers), so a JS reload is needed to see the
        // reset take effect — same as reinstalling the app. DevSettings
        // isn't implemented on react-native-web, hence the guard.
        if (typeof DevSettings?.reload === "function") {
            DevSettings.reload();
        }
    };

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

                {__DEV__ && (
                    <TouchableOpacity
                        className="border border-gray-300 rounded-xl py-3 mt-4"
                        onPress={handleResetAppData}
                    >
                        <Text className="text-gray-500 text-center font-semibold text-lg">
                            Reset App Data (Dev)
                        </Text>
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </ScrollView>
    );
}
