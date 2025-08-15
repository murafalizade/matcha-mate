import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Camera, CameraView } from "expo-camera";

type QRScannerProps = {
    onScan?: (data: string) => void;
    onCancel?: () => void;
};

export default function QRScanner({
                                      onScan,
                                      onCancel,
                                  }: QRScannerProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        Camera.requestCameraPermissionsAsync().then(({ status }) => {
            setHasPermission(status === "granted");
        });
    }, []);

    if (hasPermission === null) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator />
                <Text className="text-white mt-2">Requesting camera permission…</Text>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View className="flex-1 items-center justify-center p-6 bg-white">
                <Text className="text-center text-base font-semibold mb-2">
                    Camera permission is required
                </Text>
                <Text className="text-center text-gray-600">
                    Enable camera access in Settings and try again.
                </Text>
                {onCancel && (
                    <TouchableOpacity
                        className="mt-6 px-4 py-3 rounded-xl bg-gray-900"
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
                onBarcodeScanned={()=> console.log('scanned')}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />

            {/* Overlay UI */}
            <View className="absolute inset-0 items-center justify-between py-10">
                {/* Optional Frame */}
                <View className="w-64 h-64 border-white border-2 rounded-lg" />

                <View className="items-center">
                    <Text className="text-white/80">{"hint"}</Text>
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
