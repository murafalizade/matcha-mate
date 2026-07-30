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

import { CARAMEL, INK, MUTED } from "@/constants/colors";
import { CARD_SHADOW, INPUT_ICON_LEFT } from "@/constants/styles";
import { ChatService } from "@/services/chat";
import { ApiError } from "@/utils/api";
import { formatCountdown } from "@/utils/format";
import { ChatSession } from "@/utils/models";

const RECENT_MATCHES_LIMIT = 8;
const RECENT_AVATAR_WRAPPER_WIDTH = 64;
const RECENT_LIST_GAP = 16;
const LIST_CONTENT_PADDING_HORIZONTAL = 24;
const LIST_CONTENT_PADDING_BOTTOM = 24;
const CHAT_BADGE_ICON_SIZE = 12;

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

    const recentPartners = useMemo(() => sessions.slice(0, RECENT_MATCHES_LIMIT), [sessions]);

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView className="flex-1" edges={["top"]}>
                <View className="flex-row items-center justify-center px-6 pt-4 pb-2">
                    <Coffee color={INK} size={22} />
                    <Text className="text-xl font-bold text-ink ml-2">Social Coffee</Text>
                </View>

                <View className="px-6 mb-4">
                    <View className="relative flex-row items-center">
                        <Search color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                        <TextInput
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-panel text-ink"
                            placeholder="Search conversations..."
                            placeholderTextColor={MUTED}
                            value={query}
                            onChangeText={setQuery}
                        />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator className="mt-10" color={CARAMEL} />
                ) : error ? (
                    <Text className="text-center text-red-500">{error}</Text>
                ) : (
                    <FlatList
                        data={filteredSessions}
                        contentContainerStyle={{
                            paddingHorizontal: LIST_CONTENT_PADDING_HORIZONTAL,
                            paddingBottom: LIST_CONTENT_PADDING_BOTTOM,
                        }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={CARAMEL}
                                colors={[CARAMEL]}
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
                                        contentContainerStyle={{ gap: RECENT_LIST_GAP }}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                className="items-center"
                                                style={{ width: RECENT_AVATAR_WRAPPER_WIDTH }}
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
                            const secondsLeft = item.expiresAt
                                ? Math.floor(
                                      (new Date(item.expiresAt).getTime() - Date.now()) / 1000,
                                  )
                                : null;
                            return (
                                <TouchableOpacity
                                    className={`flex-row items-center gap-4 p-4 rounded-2xl mb-2 ${
                                        isActive ? "bg-white" : ""
                                    }`}
                                    style={isActive ? CARD_SHADOW : undefined}
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
                                                <Coffee color="white" size={CHAT_BADGE_ICON_SIZE} />
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
                                                {secondsLeft !== null
                                                    ? secondsLeft <= 0
                                                        ? "Expired"
                                                        : `${formatCountdown(secondsLeft)} left`
                                                    : item.status === "PENDING"
                                                      ? "Say hi!"
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
