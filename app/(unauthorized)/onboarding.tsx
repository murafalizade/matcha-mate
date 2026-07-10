import { router } from "expo-router";
import { MessageCircle, ScanQrCode, Users } from "lucide-react-native";
import { useRef, useState } from "react";
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingSlide } from "@/types/onboarding";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
    const { t } = useLocale();
    const { markOnboardingSeen } = useOnboarding();
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const slides: OnboardingSlide[] = [
        { Icon: ScanQrCode, title: t.onboarding.slide1Title, body: t.onboarding.slide1Body },
        { Icon: Users, title: t.onboarding.slide2Title, body: t.onboarding.slide2Body },
        { Icon: MessageCircle, title: t.onboarding.slide3Title, body: t.onboarding.slide3Body },
    ];

    const finish = () => {
        markOnboardingSeen();
        router.replace("/(unauthorized)");
    };

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
    };

    const goNext = () => {
        if (index >= slides.length - 1) {
            finish();
            return;
        }
        scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
        setIndex(index + 1);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <TouchableOpacity className="self-end px-6 pt-2" onPress={finish}>
                <Text className="text-gray-500 font-medium">{t.common.skip}</Text>
            </TouchableOpacity>

            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleMomentumScrollEnd}
            >
                {slides.map((slide) => (
                    <View key={slide.title} style={{ width }} className="items-center px-10 pt-6">
                        <View className="w-28 h-28 rounded-full bg-orange-50 items-center justify-center mb-8">
                            <slide.Icon color="#F58C26" size={56} />
                        </View>
                        <Text className="text-2xl font-bold text-center mb-3">{slide.title}</Text>
                        <Text className="text-gray-600 text-center text-base leading-6">
                            {slide.body}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View className="flex-row justify-center mb-6">
                {slides.map((slide, i) => (
                    <View
                        key={slide.title}
                        className={`h-2 rounded-full mx-1 ${
                            i === index ? "w-6 bg-[#F58C26]" : "w-2 bg-gray-300"
                        }`}
                    />
                ))}
            </View>

            <View className="px-6 pb-8">
                <TouchableOpacity className="bg-[#F58C26] rounded-xl py-4" onPress={goNext}>
                    <Text className="text-white text-center font-semibold text-lg">
                        {index === slides.length - 1 ? t.common.getStarted : t.common.next}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
