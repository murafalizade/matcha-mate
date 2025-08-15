import {View, Text, SafeAreaView, ScrollView} from "react-native";
import React from "react";
import QRScanner from "@/components/QRScanner";

export default function QrCodeScanScreen() {
    return (
        <SafeAreaView className={'bg-white flex-1'}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                className="p-6"
            >
                <View className="flex-1 items-center">
                    <Text className="text-2xl mb-2 font-semibold">Scan QR Code</Text>
                    <Text className="text-gray-600 text-center">
                        Scan the QR code at the coffee shop to connect with people nearby.
                    </Text>
                    <QRScanner />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}