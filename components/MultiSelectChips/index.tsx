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
                        className={`px-3 py-2 border rounded-full mr-2 mb-2 ${
                            isSelected ? "bg-caramel border-caramel" : "border-dot"
                        }`}
                    >
                        <Text className={isSelected ? "text-white font-semibold" : "text-muted"}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
