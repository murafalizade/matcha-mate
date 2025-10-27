import React, { useState, useCallback } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { RenderProfile } from "@/components/Card";
import { User } from "@/utils/models";

const aliceImg = require("../../assets/images/test.jpeg");
const markImg = require("../../assets/images/test.jpeg");
const sophiaImg = require("../../assets/images/test.jpeg");

const initialUsers: User[] = [
    {
        id: "1",
        firstName: "Alice",
        lastName: "",
        email: "",
        password: "",
        gender: "female",
        preferences: {
            preferredGender: "male",
            lookingFor: "friendship",
            description: "",
        },
        birthdate: new Date(1999, 5, 15),
        interests: "Coffee, Coding",
        bio: "Loves coffee & coding",
        pictureUrl: aliceImg,
    },
    {
        id: "2",
        firstName: "Mark",
        lastName: "",
        email: "",
        password: "",
        gender: "male",
        preferences: {
            preferredGender: "female",
            lookingFor: "study mate",
            description: "",
        },
        birthdate: new Date(1996, 3, 22),
        interests: "Travel, Food",
        bio: "Traveler & foodie",
        pictureUrl: markImg,
    },
    {
        id: "3",
        firstName: "Sophia",
        lastName: "",
        email: "",
        password: "",
        gender: "female",
        preferences: {
            preferredGender: "male",
            lookingFor: "friendship",
            description: "",
        },
        birthdate: new Date(2002, 1, 10),
        interests: "Music, Art",
        bio: "Music enthusiast",
        pictureUrl: sophiaImg,
    },
];

export default function HomeScreen() {
    const [profiles, setProfiles] = useState(initialUsers);
    const [refreshing, setRefreshing] = useState(false);

    const handleLike = (user: User, liked: boolean) => {
        console.log(`${liked ? "Liked" : "Unliked"}:`, user.firstName);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setProfiles((prev) => [...prev].reverse());
            setRefreshing(false);
        }, 1500);
    }, []);

    return (
        <View className="flex-1 bg-gray-100 mt-[64px]">
            <FlatList
                data={profiles}
                renderItem={({ item }) => (
                    <RenderProfile item={item} onLike={handleLike} />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#F58C26"
                        colors={["#F58C26"]}
                    />
                }
            />
        </View>
    );
}
