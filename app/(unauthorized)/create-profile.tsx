import React, { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/utils/api";

// Mirrors the backend's password/name/bio rules (see auth/constants/validation)
// so the client rejects the same input the server would, instead of a round-trip 400.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: Date;
    gender: "MALE" | "FEMALE" | "OTHER";
    bio: string;
}

const schema = yup.object({
    firstName: yup
        .string()
        .trim()
        .min(2, "Min 2 characters")
        .max(50, "Max 50 characters")
        .matches(NAME_REGEX, "Letters, spaces, ' and - only")
        .required("First name is required"),
    lastName: yup
        .string()
        .trim()
        .min(2, "Min 2 characters")
        .max(50, "Max 50 characters")
        .matches(NAME_REGEX, "Letters, spaces, ' and - only")
        .required("Last name is required"),
    email: yup.string().email("Invalid email").max(255).required("Email is required"),
    password: yup
        .string()
        .matches(PASSWORD_REGEX, "Needs upper, lower, number & special character (@$!%*?&)")
        .required("Password is required"),
    birthDate: yup.date().required("Birthdate is required"),
    gender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
    bio: yup
        .string()
        .min(10, "Min 10 characters")
        .max(500, "Max 500 characters")
        .required("Bio is required"),
});

export default function CreateProfileScreen() {
    const { register: registerUser } = useAuth();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        reValidateMode: "onChange",
    });

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) setImageUri(result.assets[0].uri);
    };

    const radioButton = (
        value: string,
        selected: string,
        label: string,
        onPress: () => void
    ) => (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 border rounded-lg ${
                selected === value
                    ? "bg-[#F58C26] border-[#F58C26]"
                    : "border-gray-300"
            }`}
        >
            <Text className={`${selected === value ? "text-white" : "text-gray-700"}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const onSubmit = async (data: FormData) => {
        if (!agree) {
            Alert.alert("Agreement Required", "You must agree to the Terms of Service.");
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
            const message = err instanceof ApiError ? err.message : "Something went wrong";
            Alert.alert("Registration failed", message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
                <Text className="text-2xl font-bold mb-6 text-center">Create Your Profile</Text>

                {/* Profile Image */}
                <TouchableOpacity onPress={pickImage} className="items-center mb-6">
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} className="w-28 h-28 rounded-full" />
                    ) : (
                        <View className="w-28 h-28 bg-gray-200 rounded-full items-center justify-center">
                            <Text className="text-gray-600">Pick Image</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* First/Last/Email/Password */}
                {(
                    [
                        { name: "firstName", label: "First Name" },
                        { name: "lastName", label: "Last Name" },
                        { name: "email", label: "Email", keyboardType: "email-address" },
                        { name: "password", label: "Password", secureTextEntry: true },
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
                            <Text className="mb-1 font-semibold">Birthdate</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <Text>{value ? value.toDateString() : "Select Date"}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={value || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) onChange(date);
                                    }}
                                />
                            )}
                            {errors.birthDate && (
                                <Text className="text-red-500 mt-1">{errors.birthDate.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Gender */}
                <Text className="font-semibold mb-2">Gender</Text>
                <Controller
                    control={control}
                    name="gender"
                    render={({ field: { onChange, value } }) => (
                        <View className="flex-row space-x-4 mb-4">
                            {radioButton("MALE", value, "Male", () => onChange("MALE"))}
                            {radioButton("FEMALE", value, "Female", () => onChange("FEMALE"))}
                            {radioButton("OTHER", value, "Other", () => onChange("OTHER"))}
                        </View>
                    )}
                />
                {errors.gender && (
                    <Text className="text-red-500 text-sm mb-2">
                        {errors.gender.message}
                    </Text>
                )}

                {/* Bio */}
                <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">Bio</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2 h-24"
                                placeholder="Tell us about yourself (min 10 characters)"
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
                    <Text className="text-gray-700">I agree to the Terms of Service</Text>
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
                            Create Profile
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
