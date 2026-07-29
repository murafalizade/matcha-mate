import { Heart, X } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { SwipeLabelProps } from "@/components/SwipeLabel/types";

// No red here on purpose — this app reserves red for destructive/error
// states (logout, error text), not a generic Tinder-style reject color.
const CONFIG = {
    like: {
        text: "LIKE",
        rotate: "-8deg",
        containerClassName: "bg-primary border-2 border-white",
        textClassName: "text-white",
        Icon: Heart,
        iconColor: "white",
        iconFill: "white",
    },
    pass: {
        text: "NOPE",
        rotate: "8deg",
        containerClassName: "bg-white border-2 border-muted",
        textClassName: "text-muted",
        Icon: X,
        iconColor: "#504443",
        iconFill: "none",
    },
} as const;

export const SwipeLabel = ({ kind }: SwipeLabelProps) => {
    const { text, rotate, containerClassName, textClassName, Icon, iconColor, iconFill } =
        CONFIG[kind];

    return (
        <View
            className={`flex-row items-center gap-2 rounded-2xl px-4 py-2 shadow-lg ${containerClassName}`}
            style={{ transform: [{ rotate }] }}
        >
            <Icon color={iconColor} fill={iconFill} size={22} />
            <Text className={`text-xl font-extrabold tracking-wider ${textClassName}`}>{text}</Text>
        </View>
    );
};
