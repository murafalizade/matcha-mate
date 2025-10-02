import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabBarIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
    return <FontAwesome name={name} size={focused ? 30 : 26} color={color} />;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingTop: 8,
                },
                headerTitleAlign: 'center',
                tabBarIconStyle: {
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                tabBarActiveTintColor: '#F58C26',
                tabBarInactiveTintColor: '#A0A0A0',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="home" color={color} focused={focused} />,
                    headerShown: true,
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="(chats)"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="comments" color={color} focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}
