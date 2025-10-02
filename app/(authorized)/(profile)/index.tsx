import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { User, Preference, Gender, LookingFor } from "@/utils/models"; // assuming your models are here

export default function ProfileScreen() {
    // Mock user
    const user: User = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "hashedpass",
        gender: "male",
        preferences: {
            preferredGender: "female",
            lookingFor: "relations",
            description: "Looking for a meaningful connection",
        },
        birthdate: new Date("1997-01-15"),
        interests: "Music, Coding, Traveling",
        bio: "I’m a software developer who loves coffee, adventures, and meeting new people.",
    };

    // Calculate age from birthdate
    const calculateAge = (birthdate: Date) => {
        const diff = Date.now() - birthdate.getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age;
    };

    const age = calculateAge(user.birthdate);

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <View className="items-center mb-6">
                <Image
                    source={{ uri: "https://i.pravatar.cc/100?img=12" }}
                    className="w-24 h-24 rounded-full mb-3"
                />
                <Text className="text-xl font-bold">{user.firstName} {user.lastName}</Text>
                <Text className="text-gray-500">{user.email}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Age</Text>
                <Text className="font-semibold text-lg">{age}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Gender</Text>
                <Text className="font-semibold text-lg capitalize">{user.gender}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Bio</Text>
                <Text className="font-semibold text-base">{user.bio}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Interests</Text>
                <Text className="font-semibold text-base">{user.interests}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Looking For</Text>
                <Text className="font-semibold text-base capitalize">
                    {user.preferences.lookingFor}
                </Text>
                <Text className="text-gray-400 mt-1">
                    Prefers: {user.preferences.preferredGender}
                </Text>
                {user.preferences.description ? (
                    <Text className="text-gray-500 mt-1">{user.preferences.description}</Text>
                ) : null}
            </View>

            <TouchableOpacity
                className="bg-[#F58C26] rounded-xl py-3 mb-3"
                onPress={() => router.push("/(authorized)/(profile)/edit")}
            >
                <Text className="text-white text-center font-semibold text-lg">
                    Edit Profile
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
        </ScrollView>
    );
}
