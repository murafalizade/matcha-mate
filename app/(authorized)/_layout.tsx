import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function TabBarIcon({ name, color, focused }: { name: string; color: string; focused: boolean }) {
    return <FontAwesome name={name} size={focused ? 28 : 24} color={color} />;
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#fff',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 5 },
                    shadowRadius: 10,
                    elevation: 10,
                },
                headerTitleAlign: 'center',
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
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="wechat" color={color} focused={focused} />,
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color, focused }) => <TabBarIcon name="user" color={color} focused={focused} />,
                    headerShown: true,
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
