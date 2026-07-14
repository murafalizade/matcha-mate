import { Text, TouchableOpacity, View } from "react-native";

import { MultiSelectChipsProps } from "@/components/MultiSelectChips/types";

export function MultiSelectChips<T extends string>({
    options,
    selected,
    onChange,
}: MultiSelectChipsProps<T>) {
    const toggle = (value: T) => {
        onChange(
            selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
        );
    };

    return (
        <View className="flex-row flex-wrap">
            {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => toggle(option.value)}
                        className={`px-3 py-2 border rounded-lg mr-2 mb-2 ${
                            isSelected ? "bg-primary border-primary" : "border-gray-300"
                        }`}
                    >
                        <Text className={isSelected ? "text-white" : "text-gray-700"}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
