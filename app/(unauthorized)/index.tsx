import { router } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useLocale } from "@/hooks/useLocale";

export default function WelcomeScreen() {
    const { t } = useLocale();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 pt-2">
                <LanguagePicker />
            </View>

            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-3xl font-bold text-center mb-3">
                    {t.welcome.title} <Text className="text-[#F58C26]">{t.welcome.brand}</Text>
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6">
                    {t.welcome.subtitle}
                </Text>
            </View>

            <View className="px-6 pb-8">
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4 mb-4"
                    onPress={() => router.push("/(unauthorized)/create-profile")}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        {t.welcome.createAccount}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border border-[#F58C26] rounded-xl py-4"
                    onPress={() => router.push("/(unauthorized)/login")}
                >
                    <Text className="text-[#F58C26] text-center font-semibold text-lg">
                        {t.welcome.logIn}
                    </Text>
                </TouchableOpacity>

                <Text className="text-center text-sm text-gray-500 mt-6">{t.welcome.terms}</Text>
            </View>
        </SafeAreaView>
    );
}
