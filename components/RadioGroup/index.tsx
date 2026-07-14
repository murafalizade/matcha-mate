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
                        className={`px-4 py-2 border rounded-full ${
                            selected ? "bg-espresso border-espresso" : "border-dot"
                        }`}
                    >
                        <Text className={selected ? "text-white font-semibold" : "text-muted"}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
