import { yupResolver } from "@hookform/resolvers/yup";
import { SlidersHorizontal } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { MultiSelectChips } from "@/components/MultiSelectChips";
import { RadioGroup } from "@/components/RadioGroup";
import { CARAMEL, MUTED } from "@/constants/colors";
import { GENDER_OPTIONS, LOOKING_FOR_OPTIONS } from "@/constants/options";
import { preferencesSchema } from "@/schemas/preferences";
import { PreferenceService } from "@/services/preference";
import { PreferencesFormData } from "@/types/preferences";
import { ApiError } from "@/utils/api";
import { capitalize, humanizeEnum } from "@/utils/format";
import { Preference } from "@/utils/models";

const DEFAULT_MIN_AGE = "18";
const DEFAULT_MAX_AGE = "35";
const SHEET_MAX_HEIGHT = "85%";

function summarize(preference: Preference): string {
    const lookingFor = preference.lookingFor?.length
        ? preference.lookingFor.map((item) => humanizeEnum(item)).join(", ")
        : "anyone";
    const gender = preference.preferredGender
        ? capitalize(humanizeEnum(preference.preferredGender))
        : "Anyone";
    return `${capitalize(lookingFor)} · ${preference.minAge}–${preference.maxAge} · ${gender}`;
}

export function PreferenceQuickEdit() {
    const [preference, setPreference] = useState<Preference | null>(null);
    const [loading, setLoading] = useState(true);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

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

    const applyToForm = useCallback(
        (value: Preference | null) => {
            reset({
                minAge: value ? String(value.minAge) : DEFAULT_MIN_AGE,
                maxAge: value ? String(value.maxAge) : DEFAULT_MAX_AGE,
                preferredGender: value?.preferredGender ?? "OTHER",
                lookingFor: value?.lookingFor ?? [],
            });
        },
        [reset],
    );

    useEffect(() => {
        let cancelled = false;
        PreferenceService.getMe()
            .then((value) => {
                if (!cancelled) {
                    setPreference(value);
                    applyToForm(value);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPreference(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [applyToForm]);

    const openSheet = () => {
        setSaveError(null);
        applyToForm(preference);
        setSheetOpen(true);
    };

    const onSubmit = async (data: PreferencesFormData) => {
        setSaveError(null);
        setSaving(true);
        try {
            const saved = await PreferenceService.updateMe({
                minAge: Number(data.minAge),
                maxAge: Number(data.maxAge),
                preferredGender: data.preferredGender,
                lookingFor: data.lookingFor,
            });
            setPreference(saved);
            setSheetOpen(false);
        } catch (err) {
            setSaveError(err instanceof ApiError ? err.message : "Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <TouchableOpacity
                className="w-full flex-row items-center bg-white rounded-2xl px-4 py-3 mb-4 border border-dot"
                onPress={openSheet}
                disabled={loading}
            >
                <SlidersHorizontal color={CARAMEL} size={18} />
                <View className="flex-1 ml-3">
                    <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
                        Who you&apos;ll meet
                    </Text>
                    {loading ? (
                        <Text className="text-muted text-sm mt-0.5">Loading…</Text>
                    ) : (
                        <Text className="text-ink text-sm mt-0.5" numberOfLines={1}>
                            {preference ? summarize(preference) : "Not set yet — tap to choose"}
                        </Text>
                    )}
                </View>
                <Text className="text-caramel font-semibold text-sm ml-2">
                    {preference ? "Edit" : "Set"}
                </Text>
            </TouchableOpacity>

            <Modal
                transparent
                visible={sheetOpen}
                animationType="slide"
                onRequestClose={() => setSheetOpen(false)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <View
                        className="bg-cream rounded-t-3xl px-6 pt-5 pb-8"
                        style={{ maxHeight: SHEET_MAX_HEIGHT }}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-xl font-bold text-ink">
                                Discovery Preferences
                            </Text>
                            <TouchableOpacity onPress={() => setSheetOpen(false)}>
                                <Text className="text-muted font-medium">Close</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="flex-row gap-4 mb-4">
                                {(
                                    [
                                        { name: "minAge", label: "Min Age" },
                                        { name: "maxAge", label: "Max Age" },
                                    ] as const
                                ).map(({ name, label }) => (
                                    <Controller
                                        key={name}
                                        control={control}
                                        name={name}
                                        render={({ field: { onChange, value } }) => (
                                            <View className="flex-1">
                                                <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                                    {label}
                                                </Text>
                                                <TextInput
                                                    className="border border-dot rounded-xl px-4 py-3 bg-panel text-ink"
                                                    keyboardType="number-pad"
                                                    placeholderTextColor={MUTED}
                                                    value={value}
                                                    onChangeText={onChange}
                                                />
                                                {errors[name] && (
                                                    <Text className="text-red-500 mt-1 text-sm">
                                                        {errors[name]?.message}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    />
                                ))}
                            </View>

                            <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                                Preferred Gender
                            </Text>
                            <Controller
                                control={control}
                                name="preferredGender"
                                render={({ field: { onChange, value } }) => (
                                    <View className="mb-5">
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
                                <Text className="text-red-500 mt-2 text-sm">
                                    {errors.lookingFor.message}
                                </Text>
                            )}

                            {saveError && (
                                <Text className="text-red-500 text-center mt-4">{saveError}</Text>
                            )}
                        </ScrollView>

                        <TouchableOpacity
                            className="bg-caramel rounded-xl py-4 mt-5"
                            onPress={handleSubmit(onSubmit)}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-lg">
                                    Save
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
}
