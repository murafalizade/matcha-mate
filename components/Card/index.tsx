import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { User } from "@/utils/models";
import { Heart } from "lucide-react-native"; // lightweight vector icons

const { width } = Dimensions.get("window");

// Helper to calculate age
const getAge = (birthdate: Date) => {
    const diff = Date.now() - new Date(birthdate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

const aliceImg = require("../../assets/images/test.jpeg");

export const RenderProfile = ({
                                  item,
                                  onLike,
                              }: {
    item: User;
    onLike: (user: User, liked: boolean) => void;
}) => {
    const [liked, setLiked] = useState(false);
    const age = getAge(item.birthdate);

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
                backgroundColor: "#fff",
                position: "relative",
            }}
        >
            {/* Profile Image */}
            <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=1' }}
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
                <Text className="text-gray-300 text-sm mt-1">
                    {item.gender} • Looking for {item.preferences?.lookingFor}
                </Text>
                {item.interests && (
                    <Text className="text-gray-200 text-sm mt-1 italic">
                        {item.interests}
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
                    <Heart fill="#FFB84D" color="#FFB84D" size={28} />
                ) : (
                    <Heart color="#FFB84D" size={28} />
                )}
            </TouchableOpacity>
        </View>
    );
};
