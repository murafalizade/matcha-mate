import { LinearGradient } from "expo-linear-gradient";
import { Coffee, MapPin } from "lucide-react-native";
import React from "react";
import { Image, Text, View } from "react-native";

import { RenderProfileProps } from "@/components/Card/types";
import { calculateAge, humanizeEnum } from "@/utils/format";

export const RenderProfile = ({ item, venueName }: RenderProfileProps) => {
    const age = calculateAge(item.birthDate);

    return (
        <View className="flex-1 bg-white rounded-3xl overflow-hidden shadow-lg">
            <View className="flex-1">
                <Image
                    source={
                        item.profileImageUrl
                            ? { uri: item.profileImageUrl }
                            : require("../../assets/images/test.jpeg")
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.65)"]}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "55%",
                        justifyContent: "flex-end",
                        padding: 20,
                    }}
                >
                    <Text className="text-white text-3xl font-bold">
                        {item.firstName}, {age}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin color="white" size={16} />
                        <Text className="text-white/90 text-sm font-medium ml-1">Here now</Text>
                    </View>
                </LinearGradient>
            </View>

            <View className="p-5">
                <View className="flex-row items-center gap-2 mb-2">
                    <Coffee color="#321716" size={18} />
                    <Text className="text-ink text-base">{venueName}</Text>
                </View>

                {item.bio && (
                    <Text className="text-muted text-sm mb-3" numberOfLines={2}>
                        {item.bio}
                    </Text>
                )}

                {item.lookingFor?.length ? (
                    <View className="flex-row flex-wrap gap-2 mb-2">
                        {item.lookingFor.map((value) => (
                            <View key={value} className="bg-caramel rounded-full px-3 py-1.5">
                                <Text className="text-white text-xs font-semibold">
                                    {humanizeEnum(value)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {item.interests.length > 0 && (
                    <View className="flex-row flex-wrap gap-2">
                        {item.interests.slice(0, 4).map((interest) => (
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
                )}
            </View>
        </View>
    );
};
