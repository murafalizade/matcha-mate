import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { ArrowLeft, Coffee, Mail } from "lucide-react-native";
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
import { INPUT_ICON_LEFT } from "@/constants/styles";
import { useLocale } from "@/hooks/useLocale";
import { forgotPasswordSchema } from "@/schemas/forgot-password";
import { AuthService } from "@/services/auth";
import { ForgotPasswordFormData } from "@/types/forgot-password";
import { ApiError } from "@/utils/api";

export default function ForgotPasswordScreen() {
    const { t } = useLocale();
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [checkEmailMessage, setCheckEmailMessage] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        reValidateMode: "onChange",
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError(null);
        setCheckEmailMessage(null);
        setSubmitting(true);
        try {
            const response = await AuthService.forgotPassword(data);
            if (response?.resetToken) {
                router.replace(`/(unauthorized)/reset-password?token=${response.resetToken}`);
                return;
            }
            setCheckEmailMessage(t.forgotPassword.checkEmailMessage);
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
                        {t.forgotPassword.title}
                    </Text>
                    <Text className="text-muted text-center">{t.forgotPassword.subtitle}</Text>
                </View>

                {checkEmailMessage ? (
                    <>
                        <Text className="text-ink text-center mb-8">{checkEmailMessage}</Text>
                        <TouchableOpacity
                            className="h-14 bg-caramel rounded-xl items-center justify-center"
                            onPress={() => router.replace("/(unauthorized)/login")}
                        >
                            <Text className="text-white text-center font-semibold text-base">
                                {t.forgotPassword.backToLogin}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
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
                                            placeholder={t.forgotPassword.emailPlaceholder}
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
                                    {t.forgotPassword.submit}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
