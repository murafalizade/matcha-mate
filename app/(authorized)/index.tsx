import React, { useState } from "react";
import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const users = [
    {
        id: "1",
        name: "Alice",
        age: 25,
        bio: "Loves coffee & coding ☕💻",
        avatar: "https://i.pravatar.cc/400?img=1",
    },
    {
        id: "2",
        name: "Mark",
        age: 28,
        bio: "Traveler & foodie 🌎🍣",
        avatar: "https://i.pravatar.cc/400?img=2",
    },
    {
        id: "3",
        name: "Sophia",
        age: 22,
        bio: "Music enthusiast 🎶",
        avatar: "https://i.pravatar.cc/400?img=3",
    },
];

export default function HomeScreen() {
    const [cards, setCards] = useState(users);

    const onSwiped = (index: number, direction: "left" | "right") => {
        console.log(`Swiped ${direction} on ${cards[index].name}`);
    };

    return (
        <View className="flex-1 bg-white items-center justify-center">
            <Swiper
                cards={cards}
                cardIndex={0}
                stackSize={3}
                stackSeparation={15}
                backgroundColor="transparent"
                onSwipedLeft={(i) => onSwiped(i, "left")}
                onSwipedRight={(i) => onSwiped(i, "right")}
                animateOverlayLabelsOpacity
                animateCardOpacity
                overlayLabels={{
                    left: {
                        title: "NOPE",
                        style: {
                            label: { color: "red", fontSize: 32, fontWeight: "800" },
                            wrapper: { position: "absolute", top: 50, left: 20 },
                        },
                    },
                    right: {
                        title: "LIKE",
                        style: {
                            label: { color: "#F58C26", fontSize: 32, fontWeight: "800" },
                            wrapper: { position: "absolute", top: 50, right: 20 },
                        },
                    },
                }}
                renderCard={(card) => (
                    <View className="bg-white rounded-3xl overflow-hidden shadow-lg w-[90%] h-[75%]">
                        <Image
                            source={{ uri: card.avatar }}
                            className="w-full h-full absolute"
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.6)"]}
                            className="absolute bottom-0 w-full p-4 rounded-b-3xl"
                        >
                            <Text className="text-white text-2xl font-bold">
                                {card.name}, {card.age}
                            </Text>
                            <Text className="text-white text-sm mt-1">{card.bio}</Text>
                        </LinearGradient>
                    </View>
                )}
            />

            {/* Manual Swipe Buttons */}
            <View className="flex-row mt-6 space-x-6">
                <TouchableOpacity
                    className="bg-white w-20 h-20 rounded-full items-center justify-center shadow-lg"
                    onPress={() => console.log("Dislike")}
                >
                    <Text className="text-red-500 text-3xl font-bold">✖</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-white w-20 h-20 rounded-full items-center justify-center shadow-lg"
                    onPress={() => console.log("Like")}
                >
                    <Text className="text-[#F58C26] text-3xl font-bold">♥</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
