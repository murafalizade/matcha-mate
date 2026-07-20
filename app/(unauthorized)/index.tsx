import { router } from "expo-router";
import { Coffee } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocale } from "@/hooks/useLocale";

export default function WelcomeScreen() {
    const { t } = useLocale();

    return (
        <SafeAreaView className="flex-1 bg-cream">
            <View className="flex-1 px-6 justify-between pb-8">
                <View className="items-center mt-4">
                    <Coffee color="#321716" size={28} />
                    <Text className="text-2xl font-bold text-ink mt-1">Social Coffee</Text>
                    <Text className="text-muted text-center text-base mt-6 leading-6">
                        {t.welcome.subtitle}
                    </Text>
                </View>

                <View className="w-full aspect-square rounded-2xl overflow-hidden">
                    <Image
                        source={require("../../assets/images/welcome/hero.png")}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                    />
                </View>

                <View>
                    <TouchableOpacity
                        className="w-full h-14 bg-caramel rounded-xl items-center justify-center mb-4"
                        onPress={() => router.push("/(unauthorized)/create-profile")}
                    >
                        <Text className="text-white font-semibold text-base">
                            {t.welcome.createAccount}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full h-14 border-2 border-ink rounded-xl items-center justify-center"
                        onPress={() => router.push("/(unauthorized)/login")}
                    >
                        <Text className="text-ink font-semibold text-base">{t.welcome.logIn}</Text>
                    </TouchableOpacity>

                    <Text className="text-center text-xs text-muted mt-5">{t.welcome.terms}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
