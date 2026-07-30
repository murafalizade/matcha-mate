import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LegalLinks } from "@/components/LegalLinks";
import { CARAMEL, IMAGE_BORDER } from "@/constants/colors";
import { CARD_SHADOW } from "@/constants/styles";
import { useAuth } from "@/hooks/useAuth";
import { ProfileService } from "@/services/profile";
import { ApiError } from "@/utils/api";
import { calculateAge, humanizeEnum } from "@/utils/format";
import { Profile } from "@/utils/models";

const PROFILE_CONTENT_PADDING = 20;

export default function ProfileScreen() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            setLoading(true);
            setError(null);
            ProfileService.getMe()
                .then((data) => {
                    if (!cancelled) {
                        setProfile(data);
                    }
                })
                .catch((err) => {
                    if (!cancelled) {
                        setError(err instanceof ApiError ? err.message : "Failed to load profile");
                    }
                })
                .finally(() => {
                    if (!cancelled) {
                        setLoading(false);
                    }
                });
            return () => {
                cancelled = true;
            };
        }, []),
    );

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-cream">
                <ActivityIndicator color={CARAMEL} size="large" />
            </View>
        );
    }

    if (error || !profile) {
        return (
            <View className="flex-1 items-center justify-center bg-cream px-6">
                <Text className="text-red-500 text-center">{error ?? "Profile unavailable"}</Text>
            </View>
        );
    }

    const age = calculateAge(profile.birthDate);

    return (
        <ScrollView
            className="flex-1 bg-cream"
            contentContainerStyle={{ padding: PROFILE_CONTENT_PADDING }}
        >
            <SafeAreaView>
                <View className="items-center mb-6">
                    <Image
                        source={
                            profile.profileImageUrl
                                ? { uri: profile.profileImageUrl }
                                : require("../../../assets/images/test.jpeg")
                        }
                        className="w-24 h-24 rounded-full mb-3 border-4"
                        style={{ borderColor: IMAGE_BORDER }}
                    />
                    <Text className="text-xl font-bold text-ink">
                        {profile.firstName} {profile.lastName}
                    </Text>
                    <Text className="text-muted">{profile.email}</Text>
                </View>

                <View className="bg-white rounded-2xl p-6 mb-6" style={CARD_SHADOW}>
                    <View className="mb-4">
                        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
                            Age
                        </Text>
                        <Text className="font-semibold text-lg text-ink">{age}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
                            Gender
                        </Text>
                        <Text className="font-semibold text-lg text-ink capitalize">
                            {profile.gender.toLowerCase()}
                        </Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
                            Bio
                        </Text>
                        <Text className="text-base text-ink">{profile.bio ?? "—"}</Text>
                    </View>

                    <View>
                        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                            Interests
                        </Text>
                        {profile.interests.length ? (
                            <View className="flex-row flex-wrap gap-2">
                                {profile.interests.map((interest) => (
                                    <View
                                        key={interest.id}
                                        className="bg-panel border border-dot rounded-full px-3 py-1.5"
                                    >
                                        <Text className="text-ink text-sm font-medium">
                                            {interest.name}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-muted">—</Text>
                        )}
                    </View>
                </View>

                <View className="bg-white rounded-2xl p-6 mb-6" style={CARD_SHADOW}>
                    <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                        Looking For
                    </Text>
                    {profile.preference ? (
                        <>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {profile.preference.lookingFor?.length ? (
                                    profile.preference.lookingFor.map((item) => (
                                        <View
                                            key={item}
                                            className="bg-caramel rounded-full px-3 py-1.5"
                                        >
                                            <Text className="text-white text-sm font-semibold">
                                                {humanizeEnum(item)}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-muted">—</Text>
                                )}
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
                                    Preferred Gender
                                </Text>
                                <Text className="font-semibold text-base text-ink capitalize">
                                    {profile.preference.preferredGender?.toLowerCase() ?? "Anyone"}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">
                                    Age Range
                                </Text>
                                <Text className="font-semibold text-base text-ink">
                                    {profile.preference.minAge}–{profile.preference.maxAge}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text className="text-muted">Not set yet</Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-caramel rounded-xl py-3 mb-3"
                    onPress={() => router.push("/(authorized)/(profile)/edit")}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Edit Profile
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="border border-dot rounded-xl py-3 mb-6"
                    onPress={() => router.push("/(authorized)/(profile)/preferences")}
                >
                    <Text className="text-center font-semibold text-ink text-lg">
                        Edit Preferences
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-red-500 rounded-xl py-3 mb-6"
                    onPress={() => logout()}
                >
                    <Text className="text-white text-center font-semibold text-lg">Log Out</Text>
                </TouchableOpacity>

                <LegalLinks />
            </SafeAreaView>
        </ScrollView>
    );
}
