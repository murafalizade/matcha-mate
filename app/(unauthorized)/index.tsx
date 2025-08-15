import {View, Text, SafeAreaView, ScrollView, TouchableOpacity} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { router } from "expo-router";

export default function WelcomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                className="p-6"
            >
                <View className="flex-1 items-center">
                    <Text className="text-2xl mb-2">Welcome to <b>Macha Mate</b></Text>
                    <Text className="text-gray-600 text-center">
                        Scan the QR code at the coffee shop to check in and start connecting with people around you.
                    </Text>
                    <TouchableOpacity
                        className="bg-[#F58C26] rounded-xl p-3 m-3"
                        onPress={() => router.push("/(unauthorized)/create-profile")}
                    >
                        <Text className="text-black text-center font-semibold text-base">
                            <FontAwesome size={20} style={{marginBottom: -3}} name={'qrcode'} />
                            <Text className={'ml-2'}>Scan QR Code</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text className="text-center text-sm text-gray-500 mb-4">
                        By continuing, you agree to our{' '}
                        <Text className="text-[#F58C26]">Terms of Service</Text> and{' '}
                        <Text className="text-[#F58C26]">Privacy Policy</Text>.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}