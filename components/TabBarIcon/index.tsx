import FontAwesome from "@expo/vector-icons/FontAwesome";

import { TabBarIconProps } from "@/components/TabBarIcon/types";

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
    return <FontAwesome name={name} size={focused ? 30 : 26} color={color} />;
}
