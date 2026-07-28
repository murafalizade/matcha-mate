import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { CafeMarkerProps } from "@/components/CafeMarker/types";

// Styled with plain inline styles rather than NativeWind classNames on purpose.
// Android renders custom Marker children by snapshotting the view into a bitmap;
// if the view still measures as zero-sized when that snapshot is taken (which is
// what happens while NativeWind resolves classNames on a later commit) the pin
// is cached blank and never appears. Inline styles are resolved synchronously on
// the first commit, so the snapshot always has real dimensions.
export function CafeMarker({ name, selected }: CafeMarkerProps) {
    return (
        <View style={{ alignItems: "center", width: 120 }}>
            <View
                style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                    // caramel / espresso from tailwind.config.js
                    backgroundColor: selected ? "#CD8F62" : "#4A2C2A",
                    // Android ignores shadow* props; elevation is its equivalent.
                    elevation: 4,
                    shadowColor: "#4A2C2A",
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                }}
            >
                <MaterialCommunityIcons name="coffee" size={18} color="white" />
            </View>
            <View
                style={{
                    marginTop: 4,
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    elevation: 2,
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{ fontSize: 12, fontWeight: "700", color: "#321716" }}
                >
                    {name}
                </Text>
            </View>
        </View>
    );
}
