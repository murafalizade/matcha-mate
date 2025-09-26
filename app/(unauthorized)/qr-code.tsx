import {View, Text, SafeAreaView, ScrollView, Modal,TextInput, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import QRScanner from "@/components/QRScanner";
import {useForm, Controller} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
// import {TextInput} from "react-native-gesture-handler";

type FormData = {
    gender: "man" | "woman" | "other";
    lookingFor: "relations" | "friendship" | "study mate";
    description: string;
};

const schema = yup.object({
    gender: yup.string().oneOf(["man", "woman", "other"]).required(),
    lookingFor: yup
        .string()
        .oneOf(["relations", "friendship", "study mate"])
        .required(),
    description: yup.string().required("Description is required"),
});

export default function QrCodeScanScreen() {
    const [hasPreference, setHasPreference] = useState(false); // mock flag
    const [modalVisible, setModalVisible] = useState(!hasPreference);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Preferences saved:", data);
        setHasPreference(true);
        setModalVisible(false);
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

    return (
        <SafeAreaView className="bg-white flex-1">
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                bounces={false}
                className="p-6"
            >
                <View className="flex-1 items-center">
                    <Text className="text-2xl mb-2 font-semibold">Scan QR Code</Text>
                    <Text className="text-gray-600 text-center mb-2">
                        Scan the QR code at the coffee shop to connect with people nearby.
                    </Text>
                    <QRScanner />
                </View>
            </ScrollView>

            {/* Preferences Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-2xl p-6 w-11/12">
                        <Text className="text-xl font-semibold mb-4 text-center">
                            Set Your Preferences
                        </Text>

                        {/* Gender */}
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
                        {errors.gender && (
                            <Text className="text-red-500 text-sm mb-2">
                                {errors.gender.message}
                            </Text>
                        )}

                        {/* Looking For */}
                        <Text className="font-semibold mb-2">Looking For</Text>
                        <Controller
                            control={control}
                            name="lookingFor"
                            render={({field: {onChange, value}}) => (
                                <View className="flex-row space-x-4 mb-4 flex-wrap">
                                    {["relations", "friendship", "study mate"].map((opt) =>
                                        radioButton(opt, value, () => onChange(opt as any))
                                    )}
                                </View>
                            )}
                        />
                        {errors.lookingFor && (
                            <Text className="text-red-500 text-sm mb-2">
                                {errors.lookingFor.message}
                            </Text>
                        )}

                        {/* Description */}
                        <Text className="font-semibold mb-2">
                            Tell others what you’re looking for
                        </Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({field: {onChange, value}}) => (
                                <TextInput
                                    className="border border-gray-300 rounded-lg px-3 py-2 h-20 mb-4"
                                    onChangeText={onChange}
                                    value={value}
                                    multiline
                                />
                            )}
                        />
                        {errors.description && (
                            <Text className="text-red-500 text-sm mb-2">
                                {errors.description.message}
                            </Text>
                        )}

                        {/* Actions */}
                        <View className="mt-4">
                            <TouchableOpacity
                                className="bg-[#F58C26] rounded-xl py-3 mb-3"
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text className="text-white text-center font-semibold text-lg">
                                    Save Preferences
                                </Text>
                            </TouchableOpacity>

                            {hasPreference && (
                                <TouchableOpacity
                                    className="border border-gray-300 rounded-xl py-3"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text className="text-gray-700 text-center font-semibold text-lg">
                                        Continue with Current
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
