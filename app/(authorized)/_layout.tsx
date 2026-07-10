import { Tabs } from "expo-router";

import { TabBarIcon } from "@/components/TabBarIcon";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingTop: 8,
                },
                headerTitleAlign: "center",
                tabBarIconStyle: {
                    alignItems: "center",
                    justifyContent: "center",
                },
                tabBarActiveTintColor: "#F58C26",
                tabBarInactiveTintColor: "#A0A0A0",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="home" color={color} focused={focused} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(chats)"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="comments" color={color} focused={focused} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name="user" color={color} focused={focused} />
                    ),
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
