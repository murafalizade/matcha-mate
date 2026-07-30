import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

import { PRIMARY } from "@/constants/colors";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View className="flex-1 items-center justify-center bg-cream p-5">
                <Text className="text-xl font-bold text-ink">This screen doesn’t exist.</Text>

                <Link href="/" className="mt-4 py-4">
                    <Text style={{ color: PRIMARY }}>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
