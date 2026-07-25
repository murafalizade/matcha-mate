import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import QRScanner from "@/components/QRScanner";
import { useVenue } from "@/hooks/useVenue";
import { VenueService } from "@/services/venue";
import { QrCodeScreenState } from "@/types/qr-code";
import { ApiError } from "@/utils/api";

export default function QrCodeScanScreen() {
    const { setCheckedInVenue } = useVenue();
    const [state, setState] = useState<QrCodeScreenState>("scanning");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [scannerKey, setScannerKey] = useState(0);

    const handleScan = async (venueId: string) => {
        setState("checking-in");
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                throw new Error("Location permission is required to check in.");
            }

            const position = await Location.getCurrentPositionAsync({});
            const venue = await VenueService.checkIn(venueId, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            setCheckedInVenue(venue);
            router.replace("/(authorized)");
        } catch (err) {
            const message = err instanceof ApiError ? err.message : (err as Error).message;
            setErrorMessage(message || "Failed to check in. Please try again.");
            setState("error");
        }
    };

    const retry = () => {
        setErrorMessage(null);
        setScannerKey((k) => k + 1);
        setState("scanning");
    };

    return (
        <SafeAreaView className="bg-cream flex-1">
            <View className="flex-1 items-center p-6">
                <Text className="text-2xl mb-2 font-semibold">Scan QR Code</Text>
                <Text className="text-gray-600 text-center mb-4">
                    Scan the QR code at the coffee shop to connect with people nearby.
                </Text>

                <View className="flex-1 w-full rounded-2xl overflow-hidden">
                    {state === "scanning" && (
                        <QRScanner
                            key={scannerKey}
                            onScan={handleScan}
                            onCancel={() => router.back()}
                        />
                    )}

                    {state === "checking-in" && (
                        <View className="flex-1 items-center justify-center bg-cream">
                            <ActivityIndicator color="#CD8F62" size="large" />
                            <Text className="text-ink mt-3">Checking in…</Text>
                        </View>
                    )}

                    {state === "error" && (
                        <View className="flex-1 items-center justify-center p-6">
                            <Text className="text-center text-base font-semibold mb-2 text-red-500">
                                {errorMessage}
                            </Text>
                            <TouchableOpacity
                                className="mt-4 px-6 py-3 rounded-xl bg-primary"
                                onPress={retry}
                            >
                                <Text className="text-white font-semibold">Scan Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
