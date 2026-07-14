import { ActivityIndicator, Text, View } from "react-native";

import { NearbyCafesStatusProps } from "@/components/NearbyCafesStatus/types";

export function NearbyCafesStatus({ state, errorMessage }: NearbyCafesStatusProps) {
    if (state === "loading") {
        return (
            <View className="flex-1 bg-cream items-center justify-center">
                <ActivityIndicator color="#CD8F62" size="large" />
            </View>
        );
    }

    if (state === "location-denied") {
        return (
            <View className="flex-1 bg-cream items-center justify-center px-8">
                <Text className="text-xl font-bold text-ink text-center mb-2">
                    Location access needed
                </Text>
                <Text className="text-muted text-center">
                    Enable location access so we can show cafes near you.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-cream items-center justify-center px-8">
            <Text className="text-muted text-center">{errorMessage}</Text>
        </View>
    );
}
