import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function WelcomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-3xl font-bold text-center mb-3">
                    Welcome to <Text className="text-[#F58C26]">Social Coffee</Text>
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6">
                    Meet, connect, and vibe with people nearby.
                    Scan the café’s QR code to check in and get started.
                </Text>
            </View>

            <View className="px-6 pb-8">
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4 mb-4"
                    onPress={() => router.push("/(authorized)")}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Create Account
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border border-[#F58C26] rounded-xl py-4"
                    onPress={() => router.push("/(unauthorized)/login")}
                >
                    <Text className="text-[#F58C26] text-center font-semibold text-lg">
                        Log In
                    </Text>
                </TouchableOpacity>

                <Text className="text-center text-sm text-gray-500 mt-6">
                    By continuing, you agree to our{" "}
                    <Text className="text-[#F58C26] font-medium">Terms of Service</Text>{" "}
                    and{" "}
                    <Text className="text-[#F58C26] font-medium">Privacy Policy</Text>.
                </Text>
            </View>
        </SafeAreaView>
    );
}
