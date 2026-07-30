import { Coffee, Search } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";

import { NearbyCafesHeaderProps } from "@/components/NearbyCafesHeader/types";
import { INK, MUTED } from "@/constants/colors";
import { INPUT_ICON_LEFT } from "@/constants/styles";

export function NearbyCafesHeader({ query, onQueryChange }: NearbyCafesHeaderProps) {
    return (
        <>
            <View className="flex-row items-center justify-center px-6 pt-4 pb-2">
                <Coffee color={INK} size={22} />
                <Text className="text-xl font-bold text-ink ml-2">Social Coffee</Text>
            </View>
            <View className="px-6 mb-4">
                <View className="relative flex-row items-center">
                    <Search color={MUTED} size={18} style={INPUT_ICON_LEFT} />
                    <TextInput
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-panel text-ink"
                        placeholder="Find your next favorite roast..."
                        placeholderTextColor={MUTED}
                        value={query}
                        onChangeText={onQueryChange}
                    />
                </View>
            </View>
        </>
    );
}
