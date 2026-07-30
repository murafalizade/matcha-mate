import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocale } from "@/hooks/useLocale";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingSlide } from "@/types/onboarding";

const { width, height } = Dimensions.get("window");
const ILLUSTRATION_HEIGHT_RATIO = 0.55;
const ILLUSTRATION_HEIGHT = height * ILLUSTRATION_HEIGHT_RATIO;
const CONTENT_SHEET_CORNER_RADIUS = 32;
const CONTENT_MAX_WIDTH = 280;

export default function OnboardingScreen() {
    const { t } = useLocale();
    const { markOnboardingSeen } = useOnboarding();
    const [index, setIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    const slides: OnboardingSlide[] = [
        {
            image: require("../../assets/images/onboarding/slide-1.png"),
            title: t.onboarding.slide1Title,
            body: t.onboarding.slide1Body,
        },
        {
            image: require("../../assets/images/onboarding/slide-2.png"),
            title: t.onboarding.slide2Title,
            body: t.onboarding.slide2Body,
        },
        {
            image: require("../../assets/images/onboarding/slide-3.png"),
            title: t.onboarding.slide3Title,
            body: t.onboarding.slide3Body,
        },
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
        <View className="flex-1 bg-panel">
            <SafeAreaView className="absolute top-0 right-0 z-10" edges={["top"]}>
                <TouchableOpacity className="px-6 pt-2" onPress={finish}>
                    <Text className="text-muted font-medium">{t.common.skip}</Text>
                </TouchableOpacity>
            </SafeAreaView>

            <View style={{ height: ILLUSTRATION_HEIGHT }}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    bounces={false}
                >
                    {slides.map((slide) => (
                        <View
                            key={slide.title}
                            style={{ width, height: ILLUSTRATION_HEIGHT }}
                            className="items-center justify-center"
                        >
                            <Image
                                source={slide.image}
                                style={{ width, height: ILLUSTRATION_HEIGHT }}
                                resizeMode="cover"
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View
                className="flex-1 bg-cream px-6 pt-8 pb-8 justify-between"
                style={{
                    marginTop: -CONTENT_SHEET_CORNER_RADIUS,
                    borderTopLeftRadius: CONTENT_SHEET_CORNER_RADIUS,
                    borderTopRightRadius: CONTENT_SHEET_CORNER_RADIUS,
                }}
            >
                <View className="items-center">
                    <Text className="text-2xl font-bold text-ink text-center mb-2">
                        {slides[index].title}
                    </Text>
                    <Text
                        className="text-muted text-center text-base leading-6"
                        style={{ maxWidth: CONTENT_MAX_WIDTH }}
                    >
                        {slides[index].body}
                    </Text>
                </View>

                <View className="items-center">
                    <View className="flex-row justify-center mb-6">
                        {slides.map((slide, i) => (
                            <View
                                key={slide.title}
                                className={`h-2 rounded-full mx-1 ${
                                    i === index ? "w-6 bg-caramel" : "w-2 bg-dot"
                                }`}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        className="w-full h-14 bg-caramel rounded-xl items-center justify-center flex-row"
                        onPress={goNext}
                    >
                        <Text className="text-white font-semibold text-base mr-2">
                            {index === slides.length - 1 ? t.common.getStarted : t.common.next}
                        </Text>
                        <ArrowRight color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
