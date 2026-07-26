import { router } from "expo-router";
import { Heart, MapPin, SlidersHorizontal, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { RenderProfile } from "@/components/Card";
import { useAuth } from "@/hooks/useAuth";
import { usePresenceFeed } from "@/hooks/usePresenceFeed";
import { useVenue } from "@/hooks/useVenue";
import { InteractionService } from "@/services/interaction";
import { VenueService } from "@/services/venue";
import { ApiError } from "@/utils/api";
import { FeedProfile } from "@/utils/models";

const BUTTON_ROW_HEIGHT = 120;
// The tab bar's own content height (see (authorized)/_layout.tsx) — react-navigation
// adds the bottom safe-area inset on top of this, so the real space it consumes
// is this plus insets.bottom.
const TAB_BAR_HEIGHT = 78;

export default function HomeScreen() {
    const { user } = useAuth();
    const { venue, clearCheckedInVenue } = useVenue();
    const { profiles, error } = usePresenceFeed(venue?.id ?? null);
    const insets = useSafeAreaInsets();
    const swiperRef = useRef<Swiper<FeedProfile>>(null);
    const [swipedCount, setSwipedCount] = useState(0);
    const [leaving, setLeaving] = useState(false);

    // The Swiper indexes cards by position, but `profiles` is a live socket feed
    // that can mutate (joins/leaves) mid-deck. Mirror it into an append-only local
    // snapshot so card indices stay stable for whoever is mid-swipe.
    const [deck, setDeck] = useState<FeedProfile[]>([]);
    useEffect(() => {
        setDeck((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const additions = profiles.filter((p) => !existingIds.has(p.id));
            return additions.length > 0 ? [...prev, ...additions] : prev;
        });
    }, [profiles]);

    // The header is rendered as an absolute overlay (not a normal flex sibling)
    // so the Swiper's immediate parent is the full screen area react-navigation
    // hands this tab — deck-swiper sizes its cards from the raw window height,
    // and cardVerticalMargin is the only thing standing between that and the
    // tab bar swallowing the bottom of the deck.
    const HEADER_HEIGHT = insets.top + 88;
    const cardVerticalMargin = (TAB_BAR_HEIGHT + insets.bottom) / 2 + 12;

    const handleLike = async (target: FeedProfile) => {
        if (!venue) {
            return;
        }
        try {
            const result = await InteractionService.like(target.id, venue.id);
            if (result.matched && result.chatSession) {
                const chatSessionId = result.chatSession.id;
                Toast.show({
                    type: "success",
                    text1: "It's a match! 🎉",
                    text2: `You and ${result.chatSession.partner.firstName} both liked each other — tap to chat`,
                    visibilityTime: 6000,
                    onPress: () => {
                        Toast.hide();
                        router.push(`/(authorized)/(chats)/message?id=${chatSessionId}`);
                    },
                });
            }
        } catch (err) {
            Alert.alert(
                "Something went wrong",
                err instanceof ApiError ? err.message : "Please try again.",
            );
        }
    };

    const handleLeaveVenue = () => {
        if (!venue) {
            return;
        }
        Alert.alert(
            "Leave venue?",
            `You'll stop seeing who's at ${venue.name} until you check in again.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Leave",
                    style: "destructive",
                    onPress: async () => {
                        setLeaving(true);
                        try {
                            await VenueService.checkOut(venue.id);
                            clearCheckedInVenue();
                        } catch (err) {
                            Alert.alert(
                                "Something went wrong",
                                err instanceof ApiError ? err.message : "Please try again.",
                            );
                        } finally {
                            setLeaving(false);
                        }
                    },
                },
            ],
        );
    };

    if (!venue) {
        return (
            <View className="flex-1 bg-cream items-center justify-center px-8">
                <Text className="text-xl font-bold text-ink text-center mb-2">Not checked in</Text>
                <Text className="text-muted text-center mb-6">
                    Scan a venue’s QR code to see who else is here.
                </Text>
                <TouchableOpacity
                    className="bg-primary rounded-xl px-6 py-3"
                    onPress={() => router.push("/(unauthorized)/qr-code")}
                >
                    <Text className="text-white font-semibold text-lg">Scan QR Code</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const hasMoreCards = swipedCount < deck.length;

    return (
        <View className="flex-1 bg-cream relative">
            <View
                className="absolute top-0 left-0 right-0 z-10 bg-cream px-5 pb-2"
                style={{ height: HEADER_HEIGHT, paddingTop: insets.top + 12 }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.push("/(authorized)/(profile)")}>
                        <Image
                            source={
                                user?.profileImageUrl
                                    ? { uri: user.profileImageUrl }
                                    : require("../../assets/images/test.jpeg")
                            }
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </TouchableOpacity>
                    <Text className="text-ink text-2xl font-bold">Social Coffee</Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(authorized)/(profile)/preferences")}
                    >
                        <SlidersHorizontal color="#321716" size={24} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-center mt-1">
                    <MapPin color="#504443" size={14} />
                    <Text className="text-muted text-xs font-medium ml-1">{venue.name}</Text>
                    <Text className="text-muted text-xs mx-1.5">·</Text>
                    <TouchableOpacity onPress={handleLeaveVenue} disabled={leaving}>
                        <Text className="text-primary text-xs font-bold">
                            {leaving ? "Leaving…" : "Leave venue"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {error && (
                <View className="absolute left-0 right-0 z-10" style={{ top: HEADER_HEIGHT }}>
                    <Text className="text-center text-red-500 py-2 bg-red-50">{error}</Text>
                </View>
            )}

            {deck.length === 0 ? (
                <View
                    className="flex-1 items-center justify-center px-8"
                    style={{ paddingTop: HEADER_HEIGHT }}
                >
                    <Text className="text-muted text-center">
                        No one else is checked in at {venue.name} right now.
                    </Text>
                </View>
            ) : !hasMoreCards ? (
                <View
                    className="flex-1 items-center justify-center px-8"
                    style={{ paddingTop: HEADER_HEIGHT }}
                >
                    <Text className="text-ink text-lg font-semibold text-center mb-2">
                        That’s everyone for now
                    </Text>
                    <Text className="text-muted text-center">
                        Check back soon as more people check in at {venue.name}.
                    </Text>
                </View>
            ) : (
                <Swiper
                    ref={swiperRef}
                    cards={deck}
                    renderCard={(item) => <RenderProfile item={item} venueName={venue.name} />}
                    keyExtractor={(item) => item.id}
                    onSwiped={() => setSwipedCount((count) => count + 1)}
                    onSwipedRight={(cardIndex) => handleLike(deck[cardIndex])}
                    backgroundColor="transparent"
                    stackSize={3}
                    stackScale={8}
                    stackSeparation={16}
                    cardVerticalMargin={cardVerticalMargin}
                    cardHorizontalMargin={16}
                    marginTop={HEADER_HEIGHT}
                    marginBottom={BUTTON_ROW_HEIGHT}
                    verticalSwipe={false}
                    disableTopSwipe
                    disableBottomSwipe
                    animateCardOpacity
                    swipeAnimationDuration={300}
                    stackAnimationFriction={8}
                    stackAnimationTension={60}
                />
            )}

            {hasMoreCards && (
                <View
                    className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-10"
                    style={{ height: BUTTON_ROW_HEIGHT }}
                >
                    <TouchableOpacity
                        className="w-16 h-16 rounded-full bg-white border border-dot items-center justify-center shadow"
                        onPress={() => swiperRef.current?.swipeLeft()}
                    >
                        <X color="#504443" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="w-20 h-20 rounded-full bg-primary items-center justify-center shadow-lg"
                        onPress={() => swiperRef.current?.swipeRight()}
                    >
                        <Heart color="white" fill="white" size={34} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
