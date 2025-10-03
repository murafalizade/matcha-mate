import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";

const { width } = Dimensions.get("window");

// Import local images
const aliceImg = require("../../assets/images/test.jpeg");
const markImg = require("../../assets/images/test.jpeg");
const sophiaImg = require("../../assets/images/test.jpeg");

const users = [
    { id: "1", name: "Alice", age: 25, gender: "Female", bio: "Loves coffee & coding ☕💻", avatar: aliceImg },
    { id: "2", name: "Mark", age: 28, gender: "Male", bio: "Traveler & foodie 🌎🍣", avatar: markImg },
    { id: "3", name: "Sophia", age: 22, gender: "Female", bio: "Music enthusiast 🎶", avatar: sophiaImg },
];

export default function HomeScreen() {
    const [profiles, setProfiles] = useState(users);

    const handleLike = (user: typeof users[0]) => {
        console.log("Liked:", user.name);
    };

    const handleNope = (user: typeof users[0]) => {
        console.log("Disliked:", user.name);
    };

    const renderProfile = ({ item }: { item: typeof users[0] }) => (
        <View
            className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden"
            style={{ width: width - 40, alignSelf: "center" }}
        >
            {/* Profile Image */}
            <Image source={item.avatar} style={{ width: "100%", height: 400 }} />

            {/* Info Section */}
            <View className="p-4">
                <View className="flex-row items-center justify-between">
                    <Text className="text-2xl font-bold">
                        {item.name}, {item.age}
                    </Text>
                    <Text className="text-gray-500">{item.gender}</Text>
                </View>
                <Text className="text-gray-700 mt-2">{item.bio}</Text>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center space-x-10 py-4">
                <TouchableOpacity
                    className="bg-white w-16 h-16 rounded-full items-center justify-center shadow"
                    onPress={() => handleNope(item)}
                >
                    <Text className="text-red-500 text-2xl font-bold">✖</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white w-16 h-16 rounded-full items-center justify-center shadow"
                    onPress={() => handleLike(item)}
                >
                    <Text className="text-[#F58C26] text-2xl font-bold">♥</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-100 pt-6">
            <FlatList
                data={profiles}
                renderItem={renderProfile}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}
