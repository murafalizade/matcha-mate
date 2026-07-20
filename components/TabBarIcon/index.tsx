import { Compass, Map, MessageCircle, User } from "lucide-react-native";
import { View } from "react-native";

import { TabBarIconName, TabBarIconProps } from "@/components/TabBarIcon/types";

const ICONS: Record<TabBarIconName, typeof Compass> = {
    discovery: Compass,
    map: Map,
    chat: MessageCircle,
    profile: User,
};

export function TabBarIcon({ name, focused }: TabBarIconProps) {
    const Icon = ICONS[name];

    if (focused) {
        return (
            <View className="w-11 h-11 rounded-full bg-espresso items-center justify-center">
                <Icon color="white" size={20} />
            </View>
        );
    }

    return <Icon color="#504443" size={22} />;
}
