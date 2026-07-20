import { Tabs } from "expo-router";

import { TabBarIcon } from "@/components/TabBarIcon";
import { useLocale } from "@/hooks/useLocale";

export default function TabLayout() {
    const { t } = useLocale();

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarActiveTintColor: "#321716",
                tabBarInactiveTintColor: "#321716",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                    marginTop: 2,
                },
                tabBarStyle: {
                    backgroundColor: "#FFF8F0",
                    borderTopWidth: 0,
                    height: 78,
                    paddingTop: 10,
                    elevation: 8,
                    shadowColor: "#4A2C2A",
                    shadowOpacity: 0.08,
                    shadowRadius: 30,
                    shadowOffset: { width: 0, height: -10 },
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
