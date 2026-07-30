import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Coffee, Eye, EyeOff, Lock } from "lucide-react-native";
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
import { useLocale } from "@/hooks/useLocale";
import { resetPasswordSchema } from "@/schemas/reset-password";
import { AuthService } from "@/services/auth";
import { ResetPasswordFormData } from "@/types/reset-password";
import { ApiError } from "@/utils/api";

export default function ResetPasswordScreen() {
    const { token } = useLocalSearchParams<{ token: string }>();
    const { t } = useLocale();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
        reValidateMode: "onChange",
        defaultValues: { newPassword: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setServerError(null);
        setSubmitting(true);
        try {
            await AuthService.resetPassword(token, { newPassword: data.newPassword });
            setSuccess(true);
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
                    <Text className="text-2xl font-bold text-ink mb-1">
                        {t.resetPassword.title}
                    </Text>
                    <Text className="text-muted text-center">{t.resetPassword.subtitle}</Text>
                </View>

                {success ? (
                    <>
                        <Text className="text-ink text-center mb-8">
                            {t.resetPassword.successMessage}
                        </Text>
                        <TouchableOpacity
                            className="h-14 bg-caramel rounded-xl items-center justify-center"
                            onPress={() => router.replace("/(unauthorized)/login")}
                        >
                            <Text className="text-white text-center font-semibold text-base">
                                {t.login.logIn}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <View className="relative justify-center">
                                        <Lock color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                        <TextInput
                                            className="border border-dot rounded-xl pl-11 pr-11 py-4 bg-panel text-ink"
                                            placeholder={t.resetPassword.newPasswordPlaceholder}
                                            placeholderTextColor={MUTED}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            textContentType="newPassword"
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
                                    {errors.newPassword && (
                                        <Text className="text-red-500 mt-1 text-sm">
                                            {errors.newPassword.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-1">
                                    <View className="relative justify-center">
                                        <Lock color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                        <TextInput
                                            className="border border-dot rounded-xl pl-11 pr-4 py-4 bg-panel text-ink"
                                            placeholder={t.resetPassword.confirmPasswordPlaceholder}
                                            placeholderTextColor={MUTED}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            textContentType="newPassword"
                                            secureTextEntry={!showPassword}
                                        />
                                    </View>
                                    {errors.confirmPassword && (
                                        <Text className="text-red-500 mt-1 text-sm">
                                            {errors.confirmPassword.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        {serverError && (
                            <Text className="text-red-500 text-center mt-4">{serverError}</Text>
                        )}

                        <TouchableOpacity
                            className="h-14 bg-caramel rounded-xl items-center justify-center mt-6"
                            onPress={handleSubmit(onSubmit)}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">
                                    {t.resetPassword.submit}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
