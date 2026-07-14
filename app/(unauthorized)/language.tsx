import { router } from "expo-router";
import { Check, Coffee } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocale } from "@/hooks/useLocale";
import { Locale } from "@/i18n/translations";
import { LanguageOption } from "@/types/language";

const LANGUAGE_OPTIONS: LanguageOption[] = [
    { value: "en", flag: "🇬🇧", name: "English" },
    { value: "ru", flag: "🇷🇺", name: "Русский" },
    { value: "tr", flag: "🇹🇷", name: "Türkçe" },
];

export default function LanguageScreen() {
    const { locale, confirmLanguage, t } = useLocale();
    const [selected, setSelected] = useState<Locale>(locale);

    const handleContinue = () => {
        confirmLanguage(selected);
        router.replace("/(unauthorized)/onboarding");
    };

    return (
        <SafeAreaView className="flex-1 bg-cream">
            {/* Header */}
            <View className="items-center px-6 pt-8 pb-4">
                <View className="flex-row items-center mb-4">
                    <Coffee color="#321716" size={32} />
                    <Text className="text-2xl font-bold text-ink ml-2">Social Coffee</Text>
                </View>
                <View className="items-center opacity-80">
                    <Text className="text-xs font-semibold text-ink uppercase tracking-widest">
                        Choose your language
                    </Text>
                    <Text className="text-xs font-semibold text-ink uppercase tracking-widest">
                        Dilinizi seçin
                    </Text>
                    <Text className="text-xs font-semibold text-ink uppercase tracking-widest">
                        Выберите язык
                    </Text>
                </View>
            </View>

            {/* Options */}
            <View className="flex-1 px-6 pt-4">
                {LANGUAGE_OPTIONS.map((option) => {
                    const isSelected = option.value === selected;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setSelected(option.value)}
                            className={`flex-row items-center justify-between p-6 bg-white rounded-xl border-2 mb-4 ${
                                isSelected ? "border-caramel" : "border-transparent"
                            }`}
                            style={{
                                shadowColor: "#4A2C2A",
                                shadowOpacity: isSelected ? 0.08 : 0.04,
                                shadowRadius: 30,
                                shadowOffset: { width: 0, height: 10 },
                            }}
                        >
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full items-center justify-center bg-panel mr-4">
                                    <Text className="text-2xl">{option.flag}</Text>
                                </View>
                                <Text className="text-lg font-semibold text-ink">
                                    {option.name}
                                </Text>
                            </View>
                            <View
                                className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                                    isSelected ? "bg-caramel border-caramel" : "border-dot"
                                }`}
                            >
                                {isSelected && <Check color="white" size={14} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Continue */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    className="h-14 bg-caramel rounded-full items-center justify-center"
                    onPress={handleContinue}
                >
                    <Text className="text-white font-semibold uppercase tracking-widest">
                        {t.common.continue}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
