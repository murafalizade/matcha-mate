import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gender, LookingFor } from "@/utils/models";
import { humanizeEnum } from "@/utils/format";
import { ProfileService } from "@/services/profile";
import { PreferenceService } from "@/services/preference";
import { ApiError } from "@/utils/api";

const LOOKING_FOR_OPTIONS: LookingFor[] = [
    "ROMANTIC_RELATIONSHIP",
    "CASUAL_DATING",
    "FRIENDSHIP",
    "NETWORKING",
    "ACTIVITY_PARTNER",
    "STUDY_BUDDY",
    "LANGUAGE_EXCHANGE",
    "COFFEE_CHAT",
    "EVENTS_COMPANION",
];

interface FormData {
    minAge: string;
    maxAge: string;
    preferredGender: Gender;
    lookingFor: LookingFor[];
}

const schema = yup.object({
    minAge: yup
        .string()
        .matches(/^\d+$/, "Must be a number")
        .test("range", "Must be between 18 and 100", (v) => !!v && +v >= 18 && +v <= 100)
        .required("Required"),
    maxAge: yup
        .string()
        .matches(/^\d+$/, "Must be a number")
        .test("range", "Must be between 18 and 100", (v) => !!v && +v >= 18 && +v <= 100)
        .test("gte-min", "Must be ≥ min age", function (v) {
            return !!v && +v >= +this.parent.minAge;
        })
        .required("Required"),
    preferredGender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
    lookingFor: yup.array().min(1, "Pick at least one").required(),
});

export default function PreferencesScreen() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: { minAge: "18", maxAge: "35", preferredGender: "OTHER", lookingFor: [] },
    });

    useEffect(() => {
        let cancelled = false;
        ProfileService.getMe()
            .then((profile) => {
                if (cancelled || !profile.preference) return;
                reset({
                    minAge: String(profile.preference.minAge),
                    maxAge: String(profile.preference.maxAge),
                    preferredGender: profile.preference.preferredGender ?? "OTHER",
                    lookingFor: profile.preference.lookingFor ?? [],
                });
            })
            .catch((err) => {
                Alert.alert("Failed to load preferences", err instanceof ApiError ? err.message : "Please try again.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [reset]);

    const onSubmit = async (data: FormData) => {
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
            Alert.alert("Failed to save", err instanceof ApiError ? err.message : "Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#F58C26" size="large" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white p-6">
            <SafeAreaView>
                <Text className="text-2xl font-bold mb-6 text-center">Preferences</Text>

                <View className="flex-row space-x-4 mb-4">
                    <Controller
                        control={control}
                        name="minAge"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <Text className="mb-1 font-semibold">Min Age</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    keyboardType="number-pad"
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {errors.minAge && (
                                    <Text className="text-red-500 mt-1 text-sm">{errors.minAge.message}</Text>
                                )}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="maxAge"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex-1">
                                <Text className="mb-1 font-semibold">Max Age</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    keyboardType="number-pad"
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {errors.maxAge && (
                                    <Text className="text-red-500 mt-1 text-sm">{errors.maxAge.message}</Text>
                                )}
                            </View>
                        )}
                    />
                </View>

                <Text className="font-semibold mb-2">Preferred Gender</Text>
                <Controller
                    control={control}
                    name="preferredGender"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row space-x-4 mb-6">
                            {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => onChange(g)}
                                    className={`px-4 py-2 border rounded-lg ${
                                        value === g ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-300"
                                    }`}
                                >
                                    <Text className={value === g ? "text-white" : "text-gray-700"}>
                                        {g.charAt(0) + g.slice(1).toLowerCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                />

                <Text className="font-semibold mb-2">Looking For</Text>
                <Controller
                    control={control}
                    name="lookingFor"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row flex-wrap mb-2">
                            {LOOKING_FOR_OPTIONS.map((option) => {
                                const selected = value.includes(option);
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        onPress={() =>
                                            onChange(
                                                selected
                                                    ? value.filter((v) => v !== option)
                                                    : [...value, option],
                                            )
                                        }
                                        className={`px-3 py-2 border rounded-lg mr-2 mb-2 ${
                                            selected ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-300"
                                        }`}
                                    >
                                        <Text className={`capitalize ${selected ? "text-white" : "text-gray-700"}`}>
                                            {humanizeEnum(option)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                />
                {errors.lookingFor && (
                    <Text className="text-red-500 mb-4 text-sm">{errors.lookingFor.message}</Text>
                )}

                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-3 mt-4"
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
