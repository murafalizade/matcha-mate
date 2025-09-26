import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

const chats = [
    {
        id: "1",
        name: "Alice Johnson",
        lastMessage: "See you at the café later?",
        time: "2:45 PM",
        avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
        id: "2",
        name: "Mark Peterson",
        lastMessage: "That was a great chat yesterday!",
        time: "1:10 PM",
        avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
        id: "3",
        name: "Sophia Lee",
        lastMessage: "Don’t forget our plan tomorrow ✨",
        time: "Yesterday",
        avatar: "https://i.pravatar.cc/100?img=3",
    },
];

export default function ChatsScreen() {
    return (
        <View className="flex-1 bg-white">
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3 border-b border-gray-200"
                        onPress={() => router.push(`/(authorized)/(chats)/message?id=${item.id}`)}
                    >
                        <Image
                            source={{ uri: item.avatar }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View className="flex-1">
                            <Text className="font-semibold text-base">{item.name}</Text>
                            <Text className="text-gray-500" numberOfLines={1}>
                                {item.lastMessage}
                            </Text>
                        </View>
                        <Text className="text-xs text-gray-400 ml-2">{item.time}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
