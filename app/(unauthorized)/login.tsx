import React from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";

interface LoginData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
});

export default function LoginScreen() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: yupResolver(schema),
        reValidateMode: "onChange",
    });

    const onSubmit = (data: LoginData) => {
        console.log("Login:", data);
        router.push("/(unauthorized)/qr-code");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="px-6 py-10"
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-center mb-2">
                        Welcome Back 👋
                    </Text>
                    <Text className="text-gray-600 text-center">
                        Login to continue connecting with people around you
                    </Text>
                </View>

                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-5">
                            <Text className="mb-2 font-semibold text-gray-700">Email</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder="Enter your email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            {errors.email && (
                                <Text className="text-red-500 mt-1 text-sm">
                                    {errors.email.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                {/* Password */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-3">
                            <Text className="mb-2 font-semibold text-gray-700">Password</Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder="Enter your password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textContentType="password"
                                secureTextEntry
                            />
                            {errors.password && (
                                <Text className="text-red-500 mt-1 text-sm">
                                    {errors.password.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                {/* Forgot password */}
                <TouchableOpacity
                    className="mb-8"
                    // onPress={() => router.push("/(unauthorized)/forgot-password")}
                >
                    <Text className="text-[#F58C26] text-right font-medium">
                        Forgot Password?
                    </Text>
                </TouchableOpacity>

                {/* Login button */}
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4"
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Log In
                    </Text>
                </TouchableOpacity>

                {/* Register link */}
                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">Don’t have an account? </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(unauthorized)/create-profile")}
                    >
                        <Text className="text-[#F58C26] font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
