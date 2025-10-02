import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { User, Gender, LookingFor } from "@/utils/models";

// Schema for editing
const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    bio: yup.string().max(200, "Max 200 characters").required("Bio is required"),
    interests: yup.string().required("At least one interest is required"),
    gender: yup.string().oneOf(["male", "female", "other"]).required(),
    lookingFor: yup.string().oneOf(["relations", "friendship", "study mate"]).required(),
});

export default function EditProfileScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<User>({
        resolver: yupResolver(schema),
        defaultValues: {
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
        },
    });

    const onSubmit = (data: User) => {
        console.log("Updated Profile:", data);
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <Text className="text-2xl font-bold mb-6 text-center">Edit Profile</Text>

            {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "bio", label: "Bio", multiline: true },
                { name: "interests", label: "Interests (comma-separated)" },
                { name: "gender", label: "Gender (male / female / other)" },
                { name: "preferences.lookingFor", label: "Looking For (relations / friendship / study mate)" },
            ].map(({ name, label, ...rest }) => (
                <Controller
                    key={name}
                    control={control}
                    name={name as any}
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">{label}</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                value={String(value)}
                                onChangeText={onChange}
                                {...rest}
                            />
                            {errors[name as keyof User] && (
                                <Text className="text-red-500 mt-1">
                                    {(errors[name as keyof User] as any)?.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
            ))}

            <TouchableOpacity
                className="bg-[#F58C26] rounded-xl py-3 mt-4"
                onPress={handleSubmit(onSubmit)}
            >
                <Text className="text-white text-center font-semibold text-lg">
                    Save Changes
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
