import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {
    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        age: 28,
        avatar: "https://i.pravatar.cc/100?img=12",
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            {/* Header */}
            <View className="items-center mb-6">
                <Image
                    source={{ uri: user.avatar }}
                    className="w-24 h-24 rounded-full mb-3"
                />
                <Text className="text-xl font-bold">{user.name}</Text>
                <Text className="text-gray-500">{user.email}</Text>
            </View>

            {/* Info Cards */}
            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Age</Text>
                <Text className="font-semibold text-lg">{user.age}</Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
                className="bg-[#F58C26] rounded-xl py-3 mb-3"
                onPress={() => router.push("/(authorized)/profile/edit")}
            >
                <Text className="text-white text-center font-semibold text-lg">
                    Edit Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="bg-gray-200 rounded-xl py-3"
                onPress={() => router.push("/(authorized)/settings")}
            >
                <Text className="text-center font-semibold text-gray-700 text-lg">
                    Settings
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
