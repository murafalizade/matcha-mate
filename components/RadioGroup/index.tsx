import { Text, TouchableOpacity, View } from "react-native";

import { RadioGroupProps } from "@/components/RadioGroup/types";

export function RadioGroup<T extends string>({ options, value, onChange }: RadioGroupProps<T>) {
    return (
        <View className="flex-row flex-wrap gap-x-4">
            {options.map((option) => {
                const selected = option.value === value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        className={`px-4 py-2 border rounded-lg ${
                            selected ? "bg-[#F58C26] border-[#F58C26]" : "border-gray-300"
                        }`}
                    >
                        <Text className={selected ? "text-white" : "text-gray-700"}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
