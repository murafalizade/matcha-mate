import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { CafeMarkerProps } from "@/components/CafeMarker/types";

export function CafeMarker({ name, selected }: CafeMarkerProps) {
    return (
        <View className="items-center">
            <View
                className={`w-9 h-9 rounded-full items-center justify-center border-2 border-white ${
                    selected ? "bg-caramel" : "bg-espresso"
                }`}
                style={{
                    shadowColor: "#4A2C2A",
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                }}
            >
                <MaterialCommunityIcons name="coffee" size={18} color="white" />
            </View>
            <View className="mt-1 bg-white px-2 py-0.5 rounded shadow-sm">
                <Text className="text-xs font-bold text-ink">{name}</Text>
            </View>
        </View>
    );
}
