import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileService } from "@/services/profile";
import { ApiError } from "@/utils/api";
import { calculateAge, humanizeEnum } from "@/utils/format";
import { Profile } from "@/utils/models";

export default function ProfileScreen() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Re-fetch every time this tab regains focus so edits made on the
    // edit/preferences screens show up without lifting state between them.
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
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#D9704A" size="large" />
            </View>
        );
    }

    if (error || !profile) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-6">
                <Text className="text-red-500 text-center">{error ?? "Profile unavailable"}</Text>
            </View>
        );
    }

    const age = calculateAge(profile.birthDate);

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <SafeAreaView>
                <View className="items-center mb-6">
                    <Image
                        source={
                            profile.profileImageUrl
                                ? { uri: profile.profileImageUrl }
                                : require("../../../assets/images/test.jpeg")
                        }
                        className="w-24 h-24 rounded-full mb-3"
                    />
                    <Text className="text-xl font-bold">
                        {profile.firstName} {profile.lastName}
                    </Text>
                    <Text className="text-gray-500">{profile.email}</Text>
                </View>

                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Age</Text>
                    <Text className="font-semibold text-lg">{age}</Text>
                </View>

                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Gender</Text>
                    <Text className="font-semibold text-lg capitalize">
                        {profile.gender.toLowerCase()}
                    </Text>
                </View>

                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Bio</Text>
                    <Text className="font-semibold text-base">{profile.bio ?? "—"}</Text>
                </View>

                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Interests</Text>
                    <Text className="font-semibold text-base">
                        {profile.interests.length
                            ? profile.interests.map((interest) => interest.name).join(", ")
                            : "—"}
                    </Text>
                </View>

                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Looking For</Text>
                    {profile.preference ? (
                        <>
                            <Text className="font-semibold text-base capitalize">
                                {profile.preference.lookingFor?.map(humanizeEnum).join(", ") ?? "—"}
                            </Text>
                            <Text className="text-gray-400 mt-1">
                                Prefers: {profile.preference.preferredGender ?? "Anyone"} · Age{" "}
                                {profile.preference.minAge}-{profile.preference.maxAge}
                            </Text>
                        </>
                    ) : (
                        <Text className="text-gray-400">Not set yet</Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-primary rounded-xl py-3 mb-3"
                    onPress={() => router.push("/(authorized)/(profile)/edit")}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Edit Profile
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-200 rounded-xl py-3 mb-3"
                    onPress={() => router.push("/(authorized)/(profile)/preferences")}
                >
                    <Text className="text-center font-semibold text-gray-700 text-lg">
                        Edit Preferences
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-gray-200 rounded-xl py-3"
                    onPress={() => router.push("/(authorized)/(profile)/settings")}
                >
                    <Text className="text-center font-semibold text-gray-700 text-lg">
                        Settings
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}
