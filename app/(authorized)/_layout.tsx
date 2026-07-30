import { Tabs } from "expo-router";

import { TabBarIcon } from "@/components/TabBarIcon";
import { CREAM, INK } from "@/constants/colors";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { CARD_SHADOW } from "@/constants/styles";
import { useLocale } from "@/hooks/useLocale";

const TAB_BAR_LABEL_FONT_SIZE = 11;
const TAB_BAR_LABEL_MARGIN_TOP = 2;
const TAB_BAR_PADDING_TOP = 10;
const TAB_BAR_ELEVATION = 8;
const TAB_BAR_SHADOW = { ...CARD_SHADOW, shadowOffset: { width: 0, height: -10 } };

export default function TabLayout() {
    const { t } = useLocale();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: INK,
                tabBarInactiveTintColor: INK,
                tabBarLabelStyle: {
                    fontSize: TAB_BAR_LABEL_FONT_SIZE,
                    fontWeight: "600",
                    marginTop: TAB_BAR_LABEL_MARGIN_TOP,
                },
                tabBarStyle: {
                    backgroundColor: CREAM,
                    borderTopWidth: 0,
                    height: TAB_BAR_HEIGHT,
                    paddingTop: TAB_BAR_PADDING_TOP,
                    elevation: TAB_BAR_ELEVATION,
                    ...TAB_BAR_SHADOW,
                },
                headerTitleAlign: "center",
                tabBarIconStyle: {
                    alignItems: "center",
                    justifyContent: "center",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t.tabs.discovery,
                    tabBarIcon: ({ focused }) => <TabBarIcon name="discovery" focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: t.tabs.map,
                    tabBarIcon: ({ focused }) => <TabBarIcon name="map" focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(chats)"
                options={{
                    title: t.tabs.chat,
                    tabBarIcon: ({ focused }) => <TabBarIcon name="chat" focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: t.tabs.profile,
                    tabBarIcon: ({ focused }) => <TabBarIcon name="profile" focused={focused} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
