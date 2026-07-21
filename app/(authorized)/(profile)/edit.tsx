import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MultiSelectChips } from "@/components/MultiSelectChips";
import { RadioGroup } from "@/components/RadioGroup";
import { editProfileSchema } from "@/schemas/edit-profile";
import { ProfileService } from "@/services/profile";
import { EditProfileFormData } from "@/types/edit-profile";
import { ApiError } from "@/utils/api";
import { Interest } from "@/utils/models";

const GENDER_OPTIONS = [
    { value: "MALE" as const, label: "Male" },
    { value: "FEMALE" as const, label: "Female" },
    { value: "OTHER" as const, label: "Other" },
];

export default function EditProfileScreen() {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageChanged, setImageChanged] = useState(false);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditProfileFormData>({
        resolver: yupResolver(editProfileSchema),
    });

    useEffect(() => {
        let cancelled = false;

        ProfileService.getMe()
            .then((profile) => {
                if (cancelled) {
                    return;
                }
                reset({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    birthDate: new Date(profile.birthDate),
                    gender: profile.gender,
                    bio: profile.bio ?? "",
                });
                setImageUri(profile.profileImageUrl);
                setSelectedInterestIds(profile.interests.map((interest) => interest.id));
            })
            .catch((err) => {
                Alert.alert(
                    "Failed to load profile",
                    err instanceof ApiError ? err.message : "Please try again.",
                );
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        // The interest catalog is a nice-to-have for this screen — if it's
        // unavailable, the picker just stays empty instead of blocking the
        // rest of the (already-fetched) profile from loading.
        ProfileService.getInterests()
            .then((allInterests) => {
                if (!cancelled) {
                    setInterests(allInterests);
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [reset]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            setImageChanged(true);
        }
    };

    const onSubmit = async (data: EditProfileFormData) => {
        setSubmitting(true);
        try {
            if (imageChanged) {
                if (imageUri) {
                    const fileName = imageUri.split("/").pop() ?? "profile.jpg";
                    const extension = fileName.split(".").pop()?.toLowerCase();
                    const mimeType =
                        extension === "png"
                            ? "image/png"
                            : extension === "webp"
                              ? "image/webp"
                              : "image/jpeg";
                    await ProfileService.uploadImage({
                        uri: imageUri,
                        name: fileName,
                        type: mimeType,
                    });
                } else {
                    await ProfileService.deleteImage();
                }
            }

            await ProfileService.updateMe({
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                birthDate: data.birthDate.toISOString().slice(0, 10),
                gender: data.gender,
                bio: data.bio,
                interestIds: selectedInterestIds,
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
                <ActivityIndicator color="#CD8F62" size="large" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ padding: 20 }}>
            <SafeAreaView edges={["bottom"]}>
                <Text className="text-2xl font-bold mb-6 text-center text-ink">Edit Profile</Text>

                <View
                    className="bg-white rounded-2xl p-6 mb-6"
                    style={{
                        shadowColor: "#4A2C2A",
                        shadowOpacity: 0.08,
                        shadowRadius: 30,
                        shadowOffset: { width: 0, height: 10 },
                    }}
                >
                    <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                className="w-28 h-28 rounded-full border-4"
                                style={{ borderColor: "#F5ECEB" }}
                            />
                        ) : (
                            <View className="w-28 h-28 bg-panel rounded-full items-center justify-center">
                                <Text className="text-muted">Pick Image</Text>
                            </View>
                        )}
                        <Text className="text-caramel mt-2 font-medium">Change Photo</Text>
                    </TouchableOpacity>
                    {imageUri && (
                        <TouchableOpacity
                            className="items-center mb-4"
                            onPress={() => {
                                setImageUri(null);
                                setImageChanged(true);
                            }}
                        >
                            <Text className="text-red-500">Remove Photo</Text>
                        </TouchableOpacity>
                    )}

                    {(
                        [
                            { name: "firstName", label: "First Name" },
                            { name: "lastName", label: "Last Name" },
                        ] as const
                    ).map(({ name, label }) => (
                        <Controller
                            key={name}
                            control={control}
                            name={name}
                            render={({ field: { onChange, value } }) => (
                                <View className="mb-4">
                                    <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                        {label}
                                    </Text>
                                    <TextInput
                                        className="border border-dot rounded-lg px-4 py-3 bg-panel text-ink"
                                        value={value}
                                        onChangeText={onChange}
                                    />
                                    {errors[name] && (
                                        <Text className="text-red-500 mt-1">
                                            {errors[name]?.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    ))}

                    <Controller
                        control={control}
                        name="birthDate"
                        render={({ field: { value, onChange } }) => (
                            <View className="mb-4">
                                <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                    Birthdate
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    className="border border-dot rounded-lg px-4 py-3 bg-panel"
                                >
                                    <Text className="text-ink">
                                        {value ? value.toDateString() : "Select Date"}
                                    </Text>
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={value || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => {
                                            setShowDatePicker(false);
                                            if (date) {
                                                onChange(date);
                                            }
                                        }}
                                    />
                                )}
                                {errors.birthDate && (
                                    <Text className="text-red-500 mt-1">
                                        {errors.birthDate.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />

                    <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                        Gender
                    </Text>
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <RadioGroup
                                    options={GENDER_OPTIONS}
                                    value={value}
                                    onChange={onChange}
                                />
                            </View>
                        )}
                    />
                    {errors.gender && (
                        <Text className="text-red-500 text-sm mb-2">{errors.gender.message}</Text>
                    )}

                    <Controller
                        control={control}
                        name="bio"
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-2">
                                <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                    Bio
                                </Text>
                                <TextInput
                                    className="border border-dot rounded-lg px-4 py-3 bg-panel text-ink h-24"
                                    multiline
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.bio && (
                                    <Text className="text-red-500 mt-1">{errors.bio.message}</Text>
                                )}
                            </View>
                        )}
                    />

                    {interests.length > 0 && (
                        <View>
                            <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                                Interests
                            </Text>
                            <MultiSelectChips
                                options={interests.map((interest) => ({
                                    value: interest.id,
                                    label: interest.name,
                                }))}
                                selected={selectedInterestIds}
                                onChange={setSelectedInterestIds}
                            />
                        </View>
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
                            Save Changes
                        </Text>
                    )}
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}
