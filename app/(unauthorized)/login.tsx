import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/schemas/login";
import { LoginData } from "@/types/login";
import { ApiError } from "@/utils/api";

export default function LoginScreen() {
    const { login } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>({
        resolver: yupResolver(loginSchema),
        reValidateMode: "onChange",
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginData) => {
        setServerError(null);
        setSubmitting(true);
        try {
            await login(data);
            // Successful login flips `isAuth`; the root layout's route guard
            // handles navigating away from this screen.
        } catch (err) {
            setServerError(err instanceof ApiError ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
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
                    <Text className="text-3xl font-bold text-center mb-2">Welcome Back 👋</Text>
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
                    <Text className="text-[#F58C26] text-right font-medium">Forgot Password?</Text>
                </TouchableOpacity>

                {serverError && (
                    <Text className="text-red-500 text-center mb-4">{serverError}</Text>
                )}

                {/* Login button */}
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4"
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-lg">Log In</Text>
                    )}
                </TouchableOpacity>

                {/* Register link */}
                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">Don’t have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/(unauthorized)/create-profile")}>
                        <Text className="text-[#F58C26] font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
