import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MultiSelectChips } from "@/components/MultiSelectChips";
import { RadioGroup } from "@/components/RadioGroup";
import { CARAMEL } from "@/constants/colors";
import { GENDER_OPTIONS, LOOKING_FOR_OPTIONS } from "@/constants/options";
import { CARD_SHADOW } from "@/constants/styles";
import { preferencesSchema } from "@/schemas/preferences";
import { PreferenceService } from "@/services/preference";
import { ProfileService } from "@/services/profile";
import { PreferencesFormData } from "@/types/preferences";
import { ApiError } from "@/utils/api";

const CONTENT_PADDING = 20;
const DEFAULT_MIN_AGE = "18";
const DEFAULT_MAX_AGE = "35";

export default function PreferencesScreen() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PreferencesFormData>({
        resolver: yupResolver(preferencesSchema),
        defaultValues: {
            minAge: DEFAULT_MIN_AGE,
            maxAge: DEFAULT_MAX_AGE,
            preferredGender: "OTHER",
            lookingFor: [],
        },
    });

    useEffect(() => {
        let cancelled = false;
        ProfileService.getMe()
            .then((profile) => {
                if (cancelled || !profile.preference) {
                    return;
                }
                reset({
                    minAge: String(profile.preference.minAge),
                    maxAge: String(profile.preference.maxAge),
                    preferredGender: profile.preference.preferredGender ?? "OTHER",
                    lookingFor: profile.preference.lookingFor ?? [],
                });
            })
            .catch((err) => {
                Alert.alert(
                    "Failed to load preferences",
                    err instanceof ApiError ? err.message : "Please try again.",
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [reset]);

    const onSubmit = async (data: PreferencesFormData) => {
        setSubmitting(true);
        try {
            await PreferenceService.updateMe({
                minAge: Number(data.minAge),
                maxAge: Number(data.maxAge),
                preferredGender: data.preferredGender,
                lookingFor: data.lookingFor,
            });
            router.back();
        } catch (err) {
            Alert.alert(
                "Failed to save",
                err instanceof ApiError ? err.message : "Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-cream">
                <ActivityIndicator color={CARAMEL} size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-cream"
            contentContainerStyle={{
                padding: CONTENT_PADDING,
                flexGrow: 1,
                justifyContent: "center",
            }}
        >
            <SafeAreaView edges={["bottom"]}>
                <Text className="text-2xl font-bold mb-6 text-center text-ink">
                    Discovery Preferences
                </Text>

                <View className="bg-white rounded-2xl p-6 mb-6" style={CARD_SHADOW}>
                    <View className="flex-row space-x-4 mb-4">
                        <Controller
                            control={control}
                            name="minAge"
                            render={({ field: { onChange, value } }) => (
                                <View className="flex-1">
                                    <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                        Min Age
                                    </Text>
                                    <TextInput
                                        className="border border-dot rounded-lg px-4 py-3 bg-panel text-ink"
                                        keyboardType="number-pad"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {errors.minAge && (
                                        <Text className="text-red-500 mt-1 text-sm">
                                            {errors.minAge.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="maxAge"
                            render={({ field: { onChange, value } }) => (
                                <View className="flex-1">
                                    <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                        Max Age
                                    </Text>
                                    <TextInput
                                        className="border border-dot rounded-lg px-4 py-3 bg-panel text-ink"
                                        keyboardType="number-pad"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {errors.maxAge && (
                                        <Text className="text-red-500 mt-1 text-sm">
                                            {errors.maxAge.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                        Preferred Gender
                    </Text>
                    <Controller
                        control={control}
                        name="preferredGender"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-6">
                                <RadioGroup
                                    options={GENDER_OPTIONS}
                                    value={value}
                                    onChange={onChange}
                                />
                            </View>
                        )}
                    />

                    <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                        Looking For
                    </Text>
                    <Controller
                        control={control}
                        name="lookingFor"
                        render={({ field: { onChange, value } }) => (
                            <MultiSelectChips
                                options={LOOKING_FOR_OPTIONS}
                                selected={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    {errors.lookingFor && (
                        <Text className="text-red-500 mb-2 text-sm">
                            {errors.lookingFor.message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-caramel rounded-xl py-4"
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-lg">
                            Save Preferences
                        </Text>
                    )}
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}
