import React, { useState } from "react";
import { SafeAreaView, Text, TextInput, View, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import {router} from "expo-router";
import {User} from "@/utils/models";

type FormData = Omit<User, "preferences" | "id">;

const schema = yup.object({
    firstName: yup.string().required("firstName is required"),
    lastName: yup.string().required("Surname is required"),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Surname is required"),
    age: yup
        .number()
        .typeError("Age must be a number")
        .required("Age is required")
        .min(1, "Age must be at least 1")
        .max(120, "Age must be realistic"),
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
                    name="firstName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">First name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.firstName && <Text className="text-red-500 mt-1">{errors.firstName.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Last name</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.lastName && <Text className="text-red-500 mt-1">{errors.lastName.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Email</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value?.toString()}
                                textContentType={'emailAddress'}
                                keyboardType="email-address"
                            />
                            {errors.email && <Text className="text-red-500 mt-1">{errors.email.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-1 font-semibold">Password</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value?.toString()}
                                textContentType={'password'}
                            />
                            {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>}
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

                        <TouchableOpacity
                            className="flex-row items-center mb-4"
                        >
                            <View
                                className={`w-5 h-5 border rounded-sm mr-2 items-center justify-center`}
                            >
                            </View>
                            <Text className="text-gray-700">I agree to the Terms of Service</Text>
                        </TouchableOpacity>


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
