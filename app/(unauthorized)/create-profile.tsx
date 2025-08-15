import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import {router} from "expo-router";

interface FormData {
    name: string;
    surname: string;
    age: number;
    gender: "male" | "female";
    termsAccepted: boolean;
}

const schema = yup.object({
    name: yup.string().required("Name is required"),
    surname: yup.string().required("Surname is required"),
    age: yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(1, "Age must be at least 1")
        .max(120, "Age must be realistic"),
    termsAccepted: yup.boolean().oneOf([true], "You must agree to the terms of service").required("You must agree to the terms of service"),
    gender: yup.string().oneOf(["male", "female"], "Select gender").required("Gender is required"),
});

export default function CreateProfileScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const onSubmit = (data: FormData) => {
        Alert.alert("Profile Created", JSON.stringify({ ...data, imageUri }, null, 2));
        router.push('/(unauthorized)/set-preferences')
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 20 , flexGrow:1}}>
                <TouchableOpacity onPress={pickImage} className="items-center mb-4">
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-24 h-24 rounded-full" />
                    ) : (
                        <View className="w-24 h-24 bg-gray-300 rounded-full items-center justify-center">
                            <Text className="text-gray-600">Pick Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.name && <Text className="text-red-500 mt-1">{errors.name.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="surname"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Surname</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.surname && <Text className="text-red-500 mt-1">{errors.surname.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="age"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Age</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value?.toString()}
                                keyboardType="numeric"
                            />
                            {errors.age && <Text className="text-red-500 mt-1">{errors.age.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-6">
                            <Text className="mb-1 font-semibold">Gender</Text>
                            <View className="flex-row space-x-4">
                                {["male", "female"].map((g) => (
                                    <TouchableOpacity
                                        key={g}
                                        className={`px-4 py-2 border rounded-lg ${value === g ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-300"}`}
                                        onPress={() => onChange(g)}
                                    >
                                        <Text className={`${value === g ? "text-white" : "text-gray-700"}`}>{g.charAt(0).toUpperCase() + g.slice(1)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {errors.gender && <Text className="text-red-500 mt-1">{errors.gender.message}</Text>}
                        </View>
                    )}
                />

                {/* Checkbox */}
                <Controller
                    control={control}
                    name="termsAccepted"
                    render={({ field: { onChange, value } }) => (
                        <TouchableOpacity
                            className="flex-row items-center mb-4"
                            onPress={() => onChange(!value)}
                        >
                            <View
                                className={`w-5 h-5 border rounded-sm mr-2 items-center justify-center ${
                                    value ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-400"
                                }`}
                            >
                                {value && <View className="w-3 h-3 bg-white" />}
                            </View>
                            <Text className="text-gray-700">I agree to the Terms of Service</Text>
                        </TouchableOpacity>
                    )}
                />

                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4 mt-auto"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-white text-center font-semibold text-lg">Create Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}