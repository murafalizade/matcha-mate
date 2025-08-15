import React from "react";
import {SafeAreaView, Text, View, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {useForm, Controller} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

type FormData = {
    ageMin: number;
    ageMax: number;
    gender: "man" | "woman";
    lookingFor: "relations" | "friendship" | "study mate";
    description: string;
};

const schema = yup.object({
    ageMin: yup
        .number()
        .typeError("Minimum age must be a number")
        .min(18, "Minimum age must be 18")
        .required("Minimum age is required"),
    ageMax: yup
        .number()
        .typeError("Maximum age must be a number")
        .moreThan(yup.ref("ageMin"), "Maximum age must be greater than minimum age")
        .max(100, "Maximum age must be realistic")
        .required("Maximum age is required"),
    gender: yup.string().oneOf(["man", "woman"], "Select gender").required(),
    lookingFor: yup.string().oneOf(["relations", "friendship", "study mate"], "Select option").required(),
    description: yup.string().required("Description is required"),
});

export default function PreferencesScreen() {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Preferences:", data);
        alert("Preferences saved!");
    };

    const radioButton = (value: string, selected: string, onPress: () => void) => (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 border rounded-lg ${selected === value ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-300"}`}
        >
            <Text
                className={`${selected === value ? "text-white" : "text-gray-700"}`}>{value.charAt(0).toUpperCase() + value.slice(1)}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{padding: 20, flexGrow: 1}}>
                <View className={'flex-1'}>
                    <Text className="font-semibold mb-2">Gender</Text>
                    <Controller
                        control={control}
                        name="gender"
                        render={({field: {onChange, value}}) => (
                            <View className="flex-row space-x-4 mb-4">
                                {["man", "woman", "other"].map((g) =>
                                    radioButton(g, value, () => onChange(g as any))
                                )}
                            </View>
                        )}
                    />

                    <Text className="font-semibold mb-2">Looking For</Text>
                    <Controller
                        control={control}
                        name="lookingFor"
                        render={({field: {onChange, value}}) => (
                            <View className="flex-row space-x-4 mb-4">
                                {["relations", "friendship", "study mate"].map((opt) =>
                                    radioButton(opt, value, () => onChange(opt as any))
                                )}
                            </View>
                        )}
                    />

                    <Text className="font-semibold mb-2">Tell others what you’re looking for</Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({field: {onChange, value}}) => (
                            <TextInput
                                className="border border-gray-300 rounded-lg px-3 py-2 h-24 text-start"
                                onChangeText={onChange}
                                value={value}
                                multiline
                            />
                        )}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        className="bg-[#F58C26] rounded-xl py-4"
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Text className="text-white text-center font-semibold text-lg">Save Preferences</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
