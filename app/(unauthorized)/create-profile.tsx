import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { User } from "@/utils/models";

type FormData = Omit<User, "preferences" | "id">;

const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Min 6 characters").required("Password is required"),
    age: yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(18, "You must be at least 18")
        .max(120, "Age must be realistic"),
});

export default function CreateProfileScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        reValidateMode: "onChange",
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const onSubmit = (data: FormData) => {
        if (!agree) {
            Alert.alert("Agreement Required", "You must agree to the Terms of Service.");
            return;
        }
        Alert.alert("Profile Created", JSON.stringify({ ...data, imageUri }, null, 2));
        router.push("/(unauthorized)/qr-code");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
                {/* Header */}
                <Text className="text-2xl font-bold mb-6 text-center">Create Your Profile</Text>

                {/* Profile Image */}
                <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-28 h-28 rounded-full" />
                    ) : (
                        <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center">
                            <Text className="text-gray-600">Pick Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "email", label: "Email", keyboardType: "email-address" },
                    { name: "password", label: "Password", secureTextEntry: true },
                    { name: "age", label: "Age", keyboardType: "numeric" },
                ].map(({ name, label, ...rest }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name as keyof FormData}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-1 font-semibold">{label}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value?.toString()}
                                    {...rest}
                                />
                                {errors[name as keyof FormData] && (
                                    <Text className="text-red-500 mt-1">
                                        {errors[name as keyof FormData]?.message as string}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                ))}

                {/* Terms Checkbox */}
                <TouchableOpacity
                    className="flex-row items-center mb-6"
                    onPress={() => setAgree(!agree)}
                >
                    <View
                        className={`w-5 h-5 border rounded mr-2 items-center justify-center ${
                            agree ? "bg-[#F58C26]" : "border-gray-400"
                        }`}
                    />
                    <Text className="text-gray-700">I agree to the Terms of Service</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="p-4">
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Create Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
