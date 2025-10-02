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
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { User } from "@/utils/models";

type FormData = Omit<User, "preferences" | "id">;

const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Min 6 characters").required("Password is required"),
    birthdate: yup.date().required("Birthdate is required"),
    gender: yup.string().oneOf(["male", "female", "other"]).required(),
    interests: yup.string().required("Interests are required"),
    bio: yup.string().max(200, "Max 200 characters").required("Bio is required"),
});

export default function CreateProfileScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

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
            <Text
                className={`${
                    selected === value ? "text-white" : "text-gray-700"
                }`}
            >
                {value.charAt(0).toUpperCase() + value.slice(1)}
            </Text>
        </TouchableOpacity>
    );

    const onSubmit = (data: FormData) => {
        if (!agree) {
            Alert.alert("Agreement Required", "You must agree to the Terms of Service.");
            return;
        }
        Alert.alert("Profile Created", JSON.stringify({ ...data, imageUri }, null, 2));
        router.push("/(unauthorized)/qr-code");
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
                {[
                    { name: "firstName", label: "First Name" },
                    { name: "lastName", label: "Last Name" },
                    { name: "email", label: "Email", keyboardType: "email-address" },
                    { name: "password", label: "Password", secureTextEntry: true },
                ].map(({ name, label, ...rest }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name as keyof FormData}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View className="mb-4">
                                <Text className="mb-1 font-semibold">{label}</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value?.toString()}
                                    {...rest}
                                />
                                {errors[name as keyof FormData] && (
                                    <Text className="text-red-500 mt-1">
                                        {errors[name as keyof FormData]?.message as string}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                ))}

                {/* Birthdate */}
                <Controller
                    control={control}
                    name="birthdate"
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
                            {errors.birthdate && (
                                <Text className="text-red-500 mt-1">{errors.birthdate.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Gender */}
                <Text className="font-semibold mb-2">Gender</Text>
                <Controller
                    control={control}
                    name="gender"
                    render={({field: {onChange, value}}) => (
                        <View className="flex-row space-x-4 mb-4">
                            {["male", "female", "other"].map((g) =>
                                radioButton(g, value, () => onChange(g as any))
                            )}
                        </View>
                    )}
                />
                {errors.gender && (
                    <Text className="text-red-500 text-sm mb-2">
                        {errors.gender.message}
                    </Text>
                )}


                {/* Interests */}
                <Controller
                    control={control}
                    name="interests"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">Interests</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2"
                                placeholder="Your interests, separated by commas"
                                onChangeText={onChange}
                                value={value}
                            />
                            {errors.interests && (
                                <Text className="text-red-500 mt-1">{errors.interests.message}</Text>
                            )}
                        </View>
                    )}
                />

                {/* Bio */}
                <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, value } }) => (
                        <View className="mb-4">
                            <Text className="mb-1 font-semibold">Bio</Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2 h-24"
                                placeholder="Tell us about yourself"
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
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Create Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
