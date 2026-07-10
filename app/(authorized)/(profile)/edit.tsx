import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { Gender } from "@/utils/models";
import {SafeAreaView} from "react-native-safe-area-context";

// Fields here map 1:1 to PATCH /profiles/me. Interests and preferences are
// edited separately (interests need a tag picker against the interests
// catalog; preferences are their own PUT /preferences/me endpoint) — not
// wired up yet, so they're intentionally left off this form rather than
// faking inputs that don't save anywhere.
interface EditFormData {
    firstName: string;
    lastName: string;
    bio: string;
    gender: Gender;
}

const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    bio: yup.string().max(500, "Max 500 characters").required("Bio is required"),
    gender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
});

export default function EditProfileScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<EditFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "John",
            lastName: "Doe",
            gender: "MALE",
            bio: "I’m a software developer who loves coffee, adventures, and meeting new people.",
        },
    });

    const onSubmit = (data: EditFormData) => {
        // TODO: wire to PATCH /profiles/me
        console.log("Updated Profile:", data);
        router.back();
    };

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <SafeAreaView>
                <Text className="text-2xl font-bold mb-6 text-center">Edit Profile</Text>

                {(
                    [
                        { name: "firstName", label: "First Name" },
                        { name: "lastName", label: "Last Name" },
                        { name: "bio", label: "Bio", multiline: true },
                        { name: "gender", label: "Gender (MALE / FEMALE / OTHER)" },
                    ] as const
                ).map(({ name, label, ...rest }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name}
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-1 font-semibold">{label}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    value={String(value)}
                                    onChangeText={onChange}
                                    {...rest}
                                />
                                {errors[name] && (
                                    <Text className="text-red-500 mt-1">
                                        {errors[name]?.message}
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
            </SafeAreaView>
        </ScrollView>
    );
}
