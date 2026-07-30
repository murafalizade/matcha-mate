import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

import { CafeMarkerProps } from "@/components/CafeMarker/types";
import { CARAMEL, ESPRESSO, INK, WHITE } from "@/constants/colors";

const MARKER_CONTAINER_WIDTH = 120;
const PIN_SIZE = 36;
const PIN_BORDER_RADIUS = 18;
const PIN_BORDER_WIDTH = 2;
const PIN_ELEVATION = 4;
const PIN_SHADOW_OPACITY = 0.2;
const PIN_SHADOW_RADIUS = 6;
const PIN_SHADOW_OFFSET = { width: 0, height: 3 };
const LABEL_MARGIN_TOP = 4;
const LABEL_PADDING_HORIZONTAL = 8;
const LABEL_PADDING_VERTICAL = 2;
const LABEL_BORDER_RADIUS = 4;
const LABEL_ELEVATION = 2;
const LABEL_FONT_SIZE = 12;

export function CafeMarker({ name, selected }: CafeMarkerProps) {
    return (
        <View style={{ alignItems: "center", width: MARKER_CONTAINER_WIDTH }}>
            <View
                style={{
                    width: PIN_SIZE,
                    height: PIN_SIZE,
                    borderRadius: PIN_BORDER_RADIUS,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: PIN_BORDER_WIDTH,
                    borderColor: WHITE,
                    backgroundColor: selected ? CARAMEL : ESPRESSO,
                    elevation: PIN_ELEVATION,
                    shadowColor: ESPRESSO,
                    shadowOpacity: PIN_SHADOW_OPACITY,
                    shadowRadius: PIN_SHADOW_RADIUS,
                    shadowOffset: PIN_SHADOW_OFFSET,
                }}
            >
                <MaterialCommunityIcons name="coffee" size={18} color={WHITE} />
            </View>
            <View
                style={{
                    marginTop: LABEL_MARGIN_TOP,
                    backgroundColor: WHITE,
                    paddingHorizontal: LABEL_PADDING_HORIZONTAL,
                    paddingVertical: LABEL_PADDING_VERTICAL,
                    borderRadius: LABEL_BORDER_RADIUS,
                    elevation: LABEL_ELEVATION,
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{ fontSize: LABEL_FONT_SIZE, fontWeight: "700", color: INK }}
                >
                    {name}
                </Text>
            </View>
        </View>
    );
}
