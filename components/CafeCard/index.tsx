import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, TouchableOpacity, View } from "react-native";

import { CafeCardProps } from "@/components/CafeCard/types";
import { CARAMEL } from "@/constants/colors";

export const CAFE_CARD_WIDTH = 240;

export function CafeCard({ venue, distanceLabel, selected, onPress }: CafeCardProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ width: CAFE_CARD_WIDTH }}
            className={`bg-white rounded-2xl p-3 flex-row gap-3 border ${
                selected ? "border-caramel" : "border-transparent"
            }`}
            activeOpacity={0.85}
        >
            <View className="w-14 h-14 rounded-xl bg-panel items-center justify-center">
                <MaterialCommunityIcons name="coffee-outline" size={26} color={CARAMEL} />
            </View>
            <View className="flex-1 justify-center">
                <Text className="font-bold text-ink" numberOfLines={1}>
                    {venue.name}
                </Text>
                {distanceLabel && <Text className="text-xs text-muted mt-1">{distanceLabel}</Text>}
            </View>
        </TouchableOpacity>
    );
}
