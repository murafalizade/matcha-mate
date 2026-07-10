import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    SafeAreaView,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";

import { RadioGroup } from "@/components/RadioGroup";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { createProfileSchema } from "@/schemas/create-profile";
import { CreateProfileFormData } from "@/types/create-profile";
import { ApiError } from "@/utils/api";

export default function CreateProfileScreen() {
    const { register: registerUser } = useAuth();
    const { t } = useLocale();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateProfileFormData>({
        resolver: yupResolver(createProfileSchema),
        reValidateMode: "onChange",
    });

    const GENDER_OPTIONS = [
        { value: "MALE" as const, label: t.createProfile.male },
        { value: "FEMALE" as const, label: t.createProfile.female },
        { value: "OTHER" as const, label: t.createProfile.other },
    ];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const onSubmit = async (data: CreateProfileFormData) => {
        if (!agree) {
            Alert.alert(
                t.createProfile.agreementRequiredTitle,
                t.createProfile.agreementRequiredBody,
            );
            return;
        }

        setSubmitting(true);
        try {
            await registerUser({
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email,
                password: data.password,
                birthDate: data.birthDate.toISOString().slice(0, 10),
                gender: data.gender,
                bio: data.bio,
            });
            // Profile picture upload happens separately via POST /profiles/me/image
            // once the profile screen is wired up — not part of registration itself.
            // Successful registration flips `isAuth`; the root layout's route guard
            // handles navigating away from this screen.
        } catch (err) {
            const message = err instanceof ApiError ? err.message : t.common.genericError;
            Alert.alert(t.createProfile.registrationFailedTitle, message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
                <Text className="text-2xl font-bold mb-6 text-center">{t.createProfile.title}</Text>

                {/* Profile Image */}
                <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-28 h-28 rounded-full" />
                    ) : (
                        <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center">
                            <Text className="text-gray-600">{t.createProfile.pickImage}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* First/Last/Email/Password */}
                {(
                    [
                        { name: "firstName", label: t.createProfile.firstName },
                        { name: "lastName", label: t.createProfile.lastName },
                        {
                            name: "email",
                            label: t.createProfile.email,
                            keyboardType: "email-address",
                        },
                        {
                            name: "password",
                            label: t.createProfile.password,
                            secureTextEntry: true,
                        },
                    ] as const
                ).map(({ name, label, ...rest }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-1 font-semibold">{label}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value?.toString()}
                                    autoCapitalize={name === "email" ? "none" : "sentences"}
                                    {...rest}
                                />
                                {errors[name] && (
                                    <Text className="text-red-500 mt-1">
                                        {errors[name]?.message as string}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                ))}

                {/* Birthdate */}
                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { value, onChange } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">{t.createProfile.birthdate}</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <Text>
                                    {value ? value.toDateString() : t.createProfile.selectDate}
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

                {/* Gender */}
                <Text className="font-semibold mb-2">{t.createProfile.gender}</Text>
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

                {/* Bio */}
                <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">{t.createProfile.bio}</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2 h-24"
                                placeholder={t.createProfile.bioPlaceholder}
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

                {/* Terms */}
                <TouchableOpacity
                    className="flex-row items-center mb-6"
                    onPress={() => setAgree(!agree)}
                >
                    <View
                        className={`w-5 h-5 border rounded mr-2 items-center justify-center ${
                            agree ? "bg-[#F58C26]" : "border-gray-400"
                        }`}
                    />
                    <Text className="text-gray-700">{t.createProfile.agreeTerms}</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View className="p-4">
                <TouchableOpacity
                    className="bg-[#F58C26] rounded-xl py-4"
                    onPress={handleSubmit(onSubmit)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-center font-semibold text-lg">
                            {t.createProfile.createProfile}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
