import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatService } from "@/services/chat";
import { ChatSession } from "@/utils/models";
import { ApiError } from "@/utils/api";

function formatTimeLeft(expiresAt: string): string {
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) return "Expired";
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s} left`;
}

export default function ChatsScreen() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setError(null);
        try {
            setSessions(await ChatService.getSessions());
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Failed to load chats");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    return (
        <View className="flex-1 bg-white h-screen">
            <SafeAreaView>
                <Text className="text-2xl font-bold mb-6 text-center">Chats</Text>

                {loading ? (
                    <ActivityIndicator className="mt-10" color="#F58C26" />
                ) : error ? (
                    <Text className="text-center text-red-500">{error}</Text>
                ) : (
                    <FlatList
                        data={sessions}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F58C26" colors={["#F58C26"]} />
                        }
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={
                            <Text className="text-center text-gray-500 mt-10">
                                No active chats yet. Match with someone at a venue to start one.
                            </Text>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-3 border-b border-gray-200"
                                onPress={() => router.push(`/(authorized)/(chats)/message?id=${item.id}`)}
                            >
                                <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
                                    <Text className="font-semibold text-gray-600 text-lg">
                                        {item.partner.firstName.charAt(0)}
                                    </Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-semibold text-base">
                                        {item.partner.firstName} {item.partner.lastName}
                                    </Text>
                                    <Text className="text-gray-500" numberOfLines={1}>
                                        {item.venue.name}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-400 ml-2">
                                    {item.status === "ACTIVE" ? formatTimeLeft(item.expiresAt) : item.status}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
