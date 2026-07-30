import { Camera, CameraView, BarcodeScanningResult } from "expo-camera";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { QRScannerProps } from "@/components/QRScanner/types";
import { CARAMEL } from "@/constants/colors";

export default function QRScanner({ onScan, onCancel }: QRScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const scannedRef = useRef(false);

    const handleBarcodeScanned = (result: BarcodeScanningResult) => {
        if (scannedRef.current) {
            return;
        }
        scannedRef.current = true;
        onScan?.(result.data);
    };

    useEffect(() => {
        Camera.requestCameraPermissionsAsync().then(({ status }) => {
            setHasPermission(status === "granted");
        });
    }, []);

    if (hasPermission === null) {
        return (
            <View className="flex-1 items-center justify-center bg-cream">
                <ActivityIndicator color={CARAMEL} />
                <Text className="text-ink mt-2">Requesting camera permission…</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View className="flex-1 items-center justify-center p-6 bg-cream">
                <Text className="text-center text-base font-semibold mb-2 text-ink">
                    Camera permission is required
                </Text>
                <Text className="text-center text-muted">
                    Enable camera access in Settings and try again.
                </Text>
                {onCancel && (
                    <TouchableOpacity
                        className="mt-6 px-4 py-3 rounded-xl bg-espresso"
                        onPress={onCancel}
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                style={{ flex: 1 }}
                onBarcodeScanned={handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
            />

            <View className="absolute inset-0 items-center justify-between py-10">
                <View className="w-64 h-64 border-white border-2 rounded-lg" />

                <View className="items-center">
                    <Text className="text-white/80">Align the QR code within the frame</Text>
                    {onCancel && (
                        <TouchableOpacity
                            className="mt-4 bg-white/15 px-5 py-3 rounded-2xl"
                            onPress={onCancel}
                        >
                            <Text className="text-white font-semibold">Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}
