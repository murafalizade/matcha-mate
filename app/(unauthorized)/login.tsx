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
import { useLocale } from "@/hooks/useLocale";
import { loginSchema } from "@/schemas/login";
import { LoginData } from "@/types/login";
import { ApiError } from "@/utils/api";

export default function LoginScreen() {
    const { login } = useAuth();
    const { t } = useLocale();
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
            setServerError(err instanceof ApiError ? err.message : t.common.genericError);
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
                    <Text className="text-3xl font-bold text-center mb-2">{t.login.title} 👋</Text>
                    <Text className="text-gray-600 text-center">{t.login.subtitle}</Text>
                </View>

                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-5">
                            <Text className="mb-2 font-semibold text-gray-700">
                                {t.login.email}
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder={t.login.emailPlaceholder}
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
                            <Text className="mb-2 font-semibold text-gray-700">
                                {t.login.password}
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                                placeholder={t.login.passwordPlaceholder}
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
                        {t.login.forgotPassword}
                    </Text>
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
                        <Text className="text-white text-center font-semibold text-lg">
                            {t.login.logIn}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Register link */}
                <View className="mt-6 flex-row justify-center">
                    <Text className="text-gray-600">{t.login.noAccount}</Text>
                    <TouchableOpacity onPress={() => router.push("/(unauthorized)/create-profile")}>
                        <Text className="text-[#F58C26] font-semibold">{t.login.signUp}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
