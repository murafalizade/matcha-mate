import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Swiper from "react-native-deck-swiper";

const { width, height } = Dimensions.get("window");

// Import local images
const aliceImg = require("../../assets/images/test.jpeg");
const markImg = require("../../assets/images/test.jpeg");
const sophiaImg = require("../../assets/images/test.jpeg");

const users = [
    { id: "1", name: "Alice", age: 25, bio: "Loves coffee & coding ☕💻", avatar: aliceImg },
    { id: "2", name: "Mark", age: 28, bio: "Traveler & foodie 🌎🍣", avatar: markImg },
    { id: "3", name: "Sophia", age: 22, bio: "Music enthusiast 🎶", avatar: sophiaImg },
];

export default function HomeScreen() {
    const [cards, setCards] = useState(users);

    const onSwiped = (index: number, direction: "left" | "right") => {
        console.log(`Swiped ${direction} on ${cards[index].name}`);
    };

    return (
        <View className="flex-1 bg-white">
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
                    <View style={{ height, borderRadius: 20, borderStyle: 'solid', borderColor: 'gray' }}>
                        <Image source={card.avatar} style={{ width: '100%', height: '50%' }} />
                            <Text className="text-3xl font-bold">
                                {card.name}, {card.age}
                            </Text>
                            <Text className=" text-base mt-1">{card.bio}</Text>
                    </View>
                )}
            />

            {/* Manual Swipe Buttons */}
            <View className="absolute bottom-6 w-full flex-row justify-center space-x-24">
                <TouchableOpacity
                    className="bg-white w-20 h-20 rounded-full items-center justify-center shadow-lg mr-5"
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
