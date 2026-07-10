import React from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { RenderProfile } from "@/components/Card";
import { FeedProfile } from "@/utils/models";
import { useVenue } from "@/hooks/useVenue";
import { usePresenceFeed } from "@/hooks/usePresenceFeed";
import { InteractionService } from "@/services/interaction";
import { ApiError } from "@/utils/api";

export default function HomeScreen() {
    const { venue } = useVenue();
    const { profiles, error } = usePresenceFeed(venue?.id ?? null);

    const handleLike = async (target: FeedProfile, liked: boolean) => {
        if (!venue) return;
        try {
            if (liked) {
                const result = await InteractionService.like(target.id, venue.id);
                if (result.matched && result.chatSession) {
                    Alert.alert(
                        "It's a match!",
                        `You and ${result.chatSession.partner.firstName} both liked each other. You have 10 minutes to chat.`,
                        [
                            {
                                text: "Chat now",
                                onPress: () =>
                                    router.push(`/(authorized)/(chats)/message?id=${result.chatSession!.id}`),
                            },
                        ],
                    );
                }
            } else {
                await InteractionService.unlike(target.id);
            }
        } catch (err) {
            Alert.alert("Something went wrong", err instanceof ApiError ? err.message : "Please try again.");
        }
    };

    if (!venue) {
        return (
            <View className="flex-1 bg-gray-100 items-center justify-center px-8">
                <Text className="text-xl font-bold text-center mb-2">Not checked in</Text>
                <Text className="text-gray-600 text-center mb-6">
                    Scan a venue's QR code to see who else is here.
                </Text>
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl px-6 py-3"
                    onPress={() => router.push("/(unauthorized)/qr-code")}
                >
                    <Text className="text-white font-semibold text-lg">Scan QR Code</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 mt-[64px]">
            {error && (
                <Text className="text-center text-red-500 py-2 bg-red-50">{error}</Text>
            )}
            <FlatList
                data={profiles}
                renderItem={({ item }) => (
                    <RenderProfile item={item} onLike={handleLike} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No one else is checked in at {venue.name} right now.
                    </Text>
                }
            />
        </View>
    );
}
