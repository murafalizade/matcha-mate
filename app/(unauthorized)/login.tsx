import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { ArrowLeft, Coffee, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { INK, MUTED } from "@/constants/colors";
import { INPUT_ICON_LEFT, INPUT_ICON_RIGHT } from "@/constants/styles";
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
    const [showPassword, setShowPassword] = useState(false);

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
        } catch (err) {
            setServerError(err instanceof ApiError ? err.message : t.common.genericError);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-cream">
            <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center ml-3 mt-1"
                onPress={() => router.back()}
            >
                <ArrowLeft color={INK} size={22} />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="px-6"
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center mt-2 mb-8">
                    <View className="w-20 h-20 rounded-full bg-espresso items-center justify-center mb-4">
                        <Coffee color="white" size={36} />
                    </View>
                    <Text className="text-2xl font-bold text-ink mb-1">{t.login.title}</Text>
                    <Text className="text-muted">{t.login.subtitle}</Text>
                </View>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                {t.login.email}
                            </Text>
                            <View className="relative justify-center">
                                <Mail color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                <TextInput
                                    className="border border-dot rounded-xl pl-11 pr-4 py-4 bg-panel text-ink"
                                    placeholder={t.login.emailPlaceholder}
                                    placeholderTextColor={MUTED}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    textContentType="emailAddress"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            {errors.email && (
                                <Text className="text-red-500 mt-1 text-sm">
                                    {errors.email.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-1">
                            <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                {t.login.password}
                            </Text>
                            <View className="relative justify-center">
                                <Lock color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                <TextInput
                                    className="border border-dot rounded-xl pl-11 pr-11 py-4 bg-panel text-ink"
                                    placeholder={t.login.passwordPlaceholder}
                                    placeholderTextColor={MUTED}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    textContentType="password"
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={INPUT_ICON_RIGHT}
                                    onPress={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <EyeOff color={MUTED} size={18} />
                                    ) : (
                                        <Eye color={MUTED} size={18} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {errors.password && (
                                <Text className="text-red-500 mt-1 text-sm">
                                    {errors.password.message}
                                </Text>
                            )}
                        </View>
                    )}
                />

                <TouchableOpacity
                    className="mb-8 mt-2"
                    onPress={() => router.push("/(unauthorized)/forgot-password")}
                >
                    <Text className="text-caramel text-right font-medium">
                        {t.login.forgotPassword}
                    </Text>
                </TouchableOpacity>

                {serverError && (
                    <Text className="text-red-500 text-center mb-4">{serverError}</Text>
                )}

                <TouchableOpacity
                    className="h-14 bg-caramel rounded-xl items-center justify-center"
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-base">
                            {t.login.logIn}
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="mt-6 mb-8 flex-row justify-center">
                    <Text className="text-muted">{t.login.noAccount}</Text>
                    <TouchableOpacity onPress={() => router.push("/(unauthorized)/create-profile")}>
                        <Text className="text-caramel font-bold">{t.login.signUp}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
