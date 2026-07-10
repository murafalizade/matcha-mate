import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Profile } from "@/utils/models"; // assuming your models are here
import { humanizeEnum } from "@/utils/format";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with GET /profiles/me once wired up.
const mockProfile: Profile = {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    gender: "MALE",
    profileImageUrl: null,
    bio: "I’m a software developer who loves coffee, adventures, and meeting new people.",
    interests: [
        { id: "i1", name: "Music" },
        { id: "i2", name: "Coding" },
        { id: "i3", name: "Traveling" },
    ],
    preference: {
        minAge: 25,
        maxAge: 35,
        preferredGender: "FEMALE",
        lookingFor: ["ROMANTIC_RELATIONSHIP"],
    },
    birthDate: "1997-01-15T00:00:00.000Z",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export default function ProfileScreen() {
    const user = mockProfile;

    // Calculate age from birthdate
    const calculateAge = (birthDate: string) => {
        const diff = Date.now() - new Date(birthDate).getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        return age;
    };

    const age = calculateAge(user.birthDate);

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <SafeAreaView>
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
                <Text className="font-semibold text-lg capitalize">{user.gender.toLowerCase()}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Bio</Text>
                <Text className="font-semibold text-base">{user.bio}</Text>
            </View>

            <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 mb-1">Interests</Text>
                <Text className="font-semibold text-base">
                    {user.interests.map((interest) => interest.name).join(", ")}
                </Text>
            </View>

            {user.preference && (
                <View className="bg-gray-100 rounded-xl p-4 mb-4">
                    <Text className="text-gray-500 mb-1">Looking For</Text>
                    <Text className="font-semibold text-base capitalize">
                        {user.preference.lookingFor?.map(humanizeEnum).join(", ") ?? "—"}
                    </Text>
                    <Text className="text-gray-400 mt-1">
                        Prefers: {user.preference.preferredGender ?? "Anyone"} · Age {user.preference.minAge}-{user.preference.maxAge}
                    </Text>
                </View>
            )}

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
            </SafeAreaView>
        </ScrollView>
    );
}
