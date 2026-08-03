import { Image, Text, View } from "react-native";

import { AvatarProps } from "@/components/Avatar/types";
import { INK, PANEL } from "@/constants/colors";

const INITIAL_FONT_RATIO = 0.4;

export function Avatar({ uri, name, size, borderWidth = 0, borderColor }: AvatarProps) {
    const shape = {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth,
        borderColor,
    };

    if (uri) {
        return <Image source={{ uri }} style={shape} />;
    }

    return (
        <View
            style={[
                shape,
                { backgroundColor: PANEL, alignItems: "center", justifyContent: "center" },
            ]}
        >
            <Text
                style={{
                    fontSize: size * INITIAL_FONT_RATIO,
                    fontWeight: "700",
                    color: INK,
                }}
            >
                {name.charAt(0).toUpperCase()}
            </Text>
        </View>
    );
}
