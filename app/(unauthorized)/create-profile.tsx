import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, Calendar, Camera, Check, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MultiSelectChips } from "@/components/MultiSelectChips";
import { RadioGroup } from "@/components/RadioGroup";
import { IMAGE_BORDER, INK, MUTED } from "@/constants/colors";
import { CARD_SHADOW, INPUT_ICON_LEFT, INPUT_ICON_RIGHT } from "@/constants/styles";
import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { createProfileSchema } from "@/schemas/create-profile";
import { ProfileService } from "@/services/profile";
import { CreateProfileFormData } from "@/types/create-profile";
import { ApiError } from "@/utils/api";
import { Interest } from "@/utils/models";

const BIO_MAX_LENGTH = 500;
const CONTENT_PADDING = 20;

export default function CreateProfileScreen() {
    const { register: registerUser } = useAuth();
    const { t } = useLocale();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);

    useEffect(() => {
        ProfileService.getInterests()
            .then(setInterests)
            .catch(() => {});
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateProfileFormData>({
        resolver: yupResolver(createProfileSchema),
        reValidateMode: "onChange",
    });

    const GENDER_OPTIONS = useMemo(
        () => [
            { value: "MALE" as const, label: t.createProfile.male },
            { value: "FEMALE" as const, label: t.createProfile.female },
            { value: "OTHER" as const, label: t.createProfile.other },
        ],
        [t],
    );

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
            if (selectedInterestIds.length > 0) {
                try {
                    await ProfileService.updateMe({ interestIds: selectedInterestIds });
                } catch {}
            }
        } catch (err) {
            const message = err instanceof ApiError ? err.message : t.common.genericError;
            Alert.alert(t.createProfile.registrationFailedTitle, message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-cream">
            <View className="flex-row items-center justify-between px-2 h-16" style={CARD_SHADOW}>
                <TouchableOpacity
                    className="w-10 h-10 rounded-full items-center justify-center"
                    onPress={() => router.back()}
                >
                    <ArrowLeft color={INK} size={22} />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-ink">{t.createProfile.title}</Text>
                <View className="w-10" />
            </View>

            <ScrollView contentContainerStyle={{ padding: CONTENT_PADDING, flexGrow: 1 }}>
                <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                    <View className="relative">
                        {imageUri ? (
                            <Image
                                source={{ uri: imageUri }}
                                className="w-32 h-32 rounded-full border-4"
                                style={{ borderColor: IMAGE_BORDER }}
                            />
                        ) : (
                            <View
                                className="w-32 h-32 bg-panel rounded-full items-center justify-center border-4"
                                style={{ borderColor: IMAGE_BORDER }}
                            >
                                <Text className="text-muted">{t.createProfile.pickImage}</Text>
                            </View>
                        )}
                        <View className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-caramel border-4 border-cream items-center justify-center">
                            <Camera color="white" size={18} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View className="flex-row gap-4 mb-4">
                    {(
                        [
                            { name: "firstName", label: t.createProfile.firstName },
                            { name: "lastName", label: t.createProfile.lastName },
                        ] as const
                    ).map(({ name, label }) => (
                        <Controller
                            key={name}
                            control={control}
                            name={name}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="flex-1">
                                    <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                        {label}
                                    </Text>
                                    <TextInput
                                        className="border border-dot rounded-xl px-4 py-3 bg-panel text-ink"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        autoCapitalize="sentences"
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

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                {t.createProfile.email}
                            </Text>
                            <View className="relative justify-center">
                                <Mail color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                <TextInput
                                    className="border border-dot rounded-xl pl-11 pr-4 py-3 bg-panel text-ink"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
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
                        <View className="mb-4">
                            <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                {t.createProfile.password}
                            </Text>
                            <View className="relative justify-center">
                                <Lock color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                                <TextInput
                                    className="border border-dot rounded-xl pl-11 pr-11 py-3 bg-panel text-ink"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
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

                <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { value, onChange } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 text-xs font-semibold text-muted uppercase tracking-widest">
                                {t.createProfile.birthdate}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="flex-row items-center justify-between border border-dot rounded-xl px-4 py-3 bg-panel"
                            >
                                <Text className="text-ink">
                                    {value ? value.toDateString() : t.createProfile.selectDate}
                                </Text>
                                <Calendar color={MUTED} size={18} />
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
                    {t.createProfile.gender}
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
                        <View className="mb-4">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-xs font-semibold text-muted uppercase tracking-widest">
                                    {t.createProfile.bio}
                                </Text>
                                <Text className="text-xs text-muted">
                                    {value?.length ?? 0}/{BIO_MAX_LENGTH}
                                </Text>
                            </View>
                            <TextInput
                                className="border border-dot rounded-xl px-4 py-3 bg-panel text-ink h-24"
                                placeholder={t.createProfile.bioPlaceholder}
                                placeholderTextColor={MUTED}
                                multiline
                                maxLength={BIO_MAX_LENGTH}
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
                    <View className="mb-4">
                        <Text className="text-xs font-semibold text-muted uppercase tracking-widest mb-2">
                            {t.createProfile.interests}
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

                <TouchableOpacity
                    className="flex-row items-center mb-6"
                    onPress={() => setAgree(!agree)}
                >
                    <View
                        className={`w-5 h-5 border rounded mr-2 items-center justify-center ${
                            agree ? "bg-caramel border-caramel" : "border-dot"
                        }`}
                    >
                        {agree && <Check color="white" size={14} />}
                    </View>
                    <Text className="text-muted">{t.createProfile.agreeTerms}</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mb-4">
                    <Text className="text-muted">{t.createProfile.alreadyHaveAccount}</Text>
                    <TouchableOpacity onPress={() => router.push("/(unauthorized)/login")}>
                        <Text className="text-caramel font-bold">{t.login.logIn}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View className="p-4">
                <TouchableOpacity
                    className="bg-caramel rounded-xl py-4"
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
