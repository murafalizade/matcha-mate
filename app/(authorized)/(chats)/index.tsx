import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { Coffee, Search } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatService } from "@/services/chat";
import { ApiError } from "@/utils/api";
import { ChatSession } from "@/utils/models";

function formatTimeLeft(expiresAt: string): string {
    const ms = new Date(expiresAt).getTime() - Date.now();
    if (ms <= 0) {
        return "Expired";
    }
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
    const [query, setQuery] = useState("");

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

    // Re-fetch every time this tab regains focus — otherwise a chat created
    // while browsing Discovery wouldn't show up until the app is relaunched,
    // since tab screens stay mounted (and this effect wouldn't rerun) when
    // you just switch tabs.
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const onRefresh = () => {
        setRefreshing(true);
        load();
    };

    const filteredSessions = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            return sessions;
        }
        return sessions.filter(
            (s) =>
                `${s.partner.firstName} ${s.partner.lastName}`.toLowerCase().includes(q) ||
                s.venue.name.toLowerCase().includes(q),
        );
    }, [sessions, query]);

    const recentPartners = useMemo(() => sessions.slice(0, 8), [sessions]);

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView className="flex-1" edges={["top"]}>
                <View className="flex-row items-center justify-center px-6 pt-4 pb-2">
                    <Coffee color="#321716" size={22} />
                    <Text className="text-xl font-bold text-ink ml-2">Social Coffee</Text>
                </View>

                <View className="px-6 mb-4">
                    <View className="relative flex-row items-center">
                        <Search
                            color="#504443"
                            size={18}
                            style={{ position: "absolute", left: 16, zIndex: 1 }}
                        />
                        <TextInput
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-panel text-ink"
                            placeholder="Search conversations..."
                            placeholderTextColor="#504443"
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator className="mt-10" color="#CD8F62" />
                ) : error ? (
                    <Text className="text-center text-red-500">{error}</Text>
                ) : (
                    <FlatList
                        data={filteredSessions}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#CD8F62"
                                colors={["#CD8F62"]}
                            />
                        }
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={
                            recentPartners.length > 0 ? (
                                <View className="mb-6">
                                    <Text className="text-lg font-bold text-ink mb-3">
                                        Recent Matches
                                    </Text>
                                    <FlatList
                                        data={recentPartners}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={{ gap: 16 }}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                className="items-center"
                                                style={{ width: 64 }}
                                                onPress={() =>
                                                    router.push(
                                                        `/(authorized)/(chats)/message?id=${item.id}`,
                                                    )
                                                }
                                            >
                                                <View
                                                    className={`w-16 h-16 rounded-full items-center justify-center ${
                                                        item.status === "ACTIVE"
                                                            ? "bg-espresso"
                                                            : "bg-panel"
                                                    }`}
                                                >
                                                    <Text
                                                        className={`font-bold text-lg ${
                                                            item.status === "ACTIVE"
                                                                ? "text-white"
                                                                : "text-ink"
                                                        }`}
                                                    >
                                                        {item.partner.firstName.charAt(0)}
                                                    </Text>
                                                </View>
                                                <Text
                                                    className="text-xs text-muted mt-1"
                                                    numberOfLines={1}
                                                >
                                                    {item.partner.firstName}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            <Text className="text-center text-muted mt-10">
                                No active chats yet. Match with someone at a venue to start one.
                            </Text>
                        }
                        renderItem={({ item }) => {
                            const isActive = item.status === "ACTIVE";
                            return (
                                <TouchableOpacity
                                    className={`flex-row items-center gap-4 p-4 rounded-2xl mb-2 ${
                                        isActive ? "bg-white" : ""
                                    }`}
                                    style={
                                        isActive
                                            ? {
                                                  shadowColor: "#4A2C2A",
                                                  shadowOpacity: 0.08,
                                                  shadowRadius: 30,
                                                  shadowOffset: { width: 0, height: 10 },
                                              }
                                            : undefined
                                    }
                                    onPress={() =>
                                        router.push(`/(authorized)/(chats)/message?id=${item.id}`)
                                    }
                                >
                                    <View className="relative">
                                        <View className="w-14 h-14 rounded-full bg-panel items-center justify-center">
                                            <Text className="font-semibold text-ink text-lg">
                                                {item.partner.firstName.charAt(0)}
                                            </Text>
                                        </View>
                                        {isActive && (
                                            <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-espresso rounded-full items-center justify-center border-2 border-cream">
                                                <Coffee color="white" size={12} />
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-1 min-w-0 border-b border-dot/40 pb-2">
                                        <View className="flex-row justify-between items-baseline mb-0.5">
                                            <Text
                                                className="font-semibold text-ink"
                                                numberOfLines={1}
                                            >
                                                {item.partner.firstName} {item.partner.lastName}
                                            </Text>
                                            <Text className="text-xs text-muted ml-2">
                                                {isActive
                                                    ? formatTimeLeft(item.expiresAt)
                                                    : item.status}
                                            </Text>
                                        </View>
                                        <Text className="text-muted" numberOfLines={1}>
                                            {item.venue.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </SafeAreaView>
        </View>
    );
}
