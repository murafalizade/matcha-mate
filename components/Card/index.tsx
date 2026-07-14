import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native"; // lightweight vector icons
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

import { RenderProfileProps } from "@/components/Card/types";
import { calculateAge, humanizeEnum } from "@/utils/format";

const { width } = Dimensions.get("window");

export const RenderProfile = ({ item, onLike }: RenderProfileProps) => {
    const [liked, setLiked] = useState(false);
    const age = calculateAge(item.birthDate);

    const handleLike = () => {
        const newLikeState = !liked;
        setLiked(newLikeState);
        onLike(item, newLikeState);
    };

    return (
        <View
            className="rounded-3xl shadow-lg mt-8 overflow-hidden"
            style={{
                width: width - 32,
                alignSelf: "center",
                backgroundColor: "#FFF8F0",
                position: "relative",
            }}
        >
            {/* Profile Image */}
            <Image
                source={
                    item.profileImageUrl
                        ? { uri: item.profileImageUrl }
                        : require("../../assets/images/test.jpeg")
                }
                style={{ width: "100%", height: 320, borderRadius: 24 }}
            />

            {/* Gradient overlay */}
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 200,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    justifyContent: "flex-end",
                    padding: 20,
                }}
            >
                <Text className="text-white text-3xl font-bold">
                    {item.firstName} {item.lastName}, {age}
                </Text>
                <Text className="text-gray-300 text-sm mt-1 capitalize">
                    {item.gender.toLowerCase()}
                    {item.lookingFor?.length
                        ? ` • Looking for ${item.lookingFor.map(humanizeEnum).join(", ")}`
                        : ""}
                </Text>
                {item.interests.length > 0 && (
                    <Text className="text-gray-200 text-sm mt-1 italic">
                        {item.interests.map((interest) => interest.name).join(", ")}
                    </Text>
                )}
                {item.bio && (
                    <Text className="text-gray-100 text-sm mt-2" numberOfLines={2}>
                        {item.bio}
                    </Text>
                )}
            </LinearGradient>

            {/* Like Button */}
            <TouchableOpacity
                onPress={handleLike}
                className="absolute right-5 bottom-8 bg-white w-14 h-14 rounded-full items-center justify-center shadow-lg"
                activeOpacity={0.85}
            >
                {liked ? (
                    <Heart fill="#D9704A" color="#D9704A" size={28} />
                ) : (
                    <Heart color="#D9704A" size={28} />
                )}
            </TouchableOpacity>
        </View>
    );
};
