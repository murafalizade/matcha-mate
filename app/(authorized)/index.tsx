import { router } from "expo-router";
import { Heart, MapPin, SlidersHorizontal, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Avatar } from "@/components/Avatar";
import { RenderProfile } from "@/components/Card";
import { ConfirmModal } from "@/components/ConfirmModal";
import { SwipeLabel } from "@/components/SwipeLabel";
import { INK, MUTED } from "@/constants/colors";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAuth } from "@/hooks/useAuth";
import { usePresenceFeed } from "@/hooks/usePresenceFeed";
import { useVenue } from "@/hooks/useVenue";
import { InteractionService } from "@/services/interaction";
import { VenueService } from "@/services/venue";
import { ApiError } from "@/utils/api";
import { FeedProfile, MatchFoundPayload } from "@/utils/models";

const BUTTON_ROW_HEIGHT = 120;
const HEADER_CONTENT_HEIGHT = 88;
const HEADER_PADDING_TOP_EXTRA = 12;
const CARD_VERTICAL_MARGIN_EXTRA = 12;
const AVATAR_SIZE = 40;
const MATCH_TOAST_VISIBILITY_MS = 6000;
const SWIPER_STACK_SIZE = 3;
const SWIPER_STACK_SCALE = 8;
const SWIPER_STACK_SEPARATION = 16;
const SWIPER_CARD_HORIZONTAL_MARGIN = 16;
const SWIPE_ANIMATION_DURATION_MS = 220;
const SWIPE_SPRING = { friction: 10, tension: 90 };
const OVERLAY_PADDING_TOP = 48;
const OVERLAY_PADDING_SIDE = 24;
const PASS_ICON_SIZE = 30;
const LIKE_ICON_SIZE = 34;

export default function HomeScreen() {
    const { user } = useAuth();
    const { venue, clearCheckedInVenue } = useVenue();
    const insets = useSafeAreaInsets();
    const swiperRef = useRef<Swiper<FeedProfile>>(null);
    const [swipedCount, setSwipedCount] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const handleMatchFound = (payload: MatchFoundPayload) => {
        Toast.show({
            type: "success",
            text1: "It's a match! 🎉",
            text2: `You and ${payload.partner.firstName} both liked each other — tap to chat`,
            visibilityTime: MATCH_TOAST_VISIBILITY_MS,
            onPress: () => {
                Toast.hide();
                router.push(`/(authorized)/(chats)/message?id=${payload.chatSessionId}`);
            },
        });
    };

    const { profiles, error } = usePresenceFeed(venue?.id ?? null, handleMatchFound);

    const [deck, setDeck] = useState<FeedProfile[]>([]);
    useEffect(() => {
        setDeck((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const additions = profiles.filter((p) => !existingIds.has(p.id));
            return additions.length > 0 ? [...prev, ...additions] : prev;
        });
    }, [profiles]);

    const HEADER_HEIGHT = insets.top + HEADER_CONTENT_HEIGHT;
    const cardVerticalMargin = (TAB_BAR_HEIGHT + insets.bottom) / 2 + CARD_VERTICAL_MARGIN_EXTRA;

    const handleLike = async (target: FeedProfile) => {
        if (!venue) {
            return;
        }
        try {
            await InteractionService.like(target.id, venue.id);
        } catch (err) {
            Alert.alert(
                "Something went wrong",
                err instanceof ApiError ? err.message : "Please try again.",
            );
        }
    };

    const confirmLeaveVenue = async () => {
        if (!venue) {
            return;
        }
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
            setShowLeaveModal(false);
        }
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
                style={{ height: HEADER_HEIGHT, paddingTop: insets.top + HEADER_PADDING_TOP_EXTRA }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.push("/(authorized)/(profile)")}>
                        <Avatar
                            uri={user?.profileImageUrl ?? null}
                            name={user?.firstName ?? ""}
                            size={AVATAR_SIZE}
                        />
                    </TouchableOpacity>
                    <Text className="text-ink text-2xl font-bold">Social Coffee</Text>
                    <TouchableOpacity
                        onPress={() => router.push("/(authorized)/(profile)/preferences")}
                    >
                        <SlidersHorizontal color={INK} size={24} />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-center mt-1">
                    <MapPin color={MUTED} size={14} />
                    <Text className="text-muted text-xs font-medium ml-1">{venue.name}</Text>
                    <Text className="text-muted text-xs mx-1.5">·</Text>
                    <TouchableOpacity onPress={() => setShowLeaveModal(true)} disabled={leaving}>
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
                    key={deck.length}
                    cardIndex={swipedCount}
                    renderCard={(item) =>
                        item ? <RenderProfile item={item} venueName={venue.name} /> : null
                    }
                    keyExtractor={(item) => item.id}
                    onSwiped={() => setSwipedCount((count) => count + 1)}
                    onSwipedRight={(cardIndex) => handleLike(deck[cardIndex])}
                    backgroundColor="transparent"
                    stackSize={SWIPER_STACK_SIZE}
                    stackScale={SWIPER_STACK_SCALE}
                    stackSeparation={SWIPER_STACK_SEPARATION}
                    cardVerticalMargin={cardVerticalMargin}
                    cardHorizontalMargin={SWIPER_CARD_HORIZONTAL_MARGIN}
                    marginTop={HEADER_HEIGHT}
                    marginBottom={BUTTON_ROW_HEIGHT}
                    verticalSwipe={false}
                    disableTopSwipe
                    disableBottomSwipe
                    animateOverlayLabelsOpacity
                    overlayLabels={{
                        left: {
                            element: <SwipeLabel kind="pass" />,
                            style: {
                                wrapper: {
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",
                                    paddingTop: OVERLAY_PADDING_TOP,
                                    paddingRight: OVERLAY_PADDING_SIDE,
                                },
                            },
                        },
                        right: {
                            element: <SwipeLabel kind="like" />,
                            style: {
                                wrapper: {
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    paddingTop: OVERLAY_PADDING_TOP,
                                    paddingLeft: OVERLAY_PADDING_SIDE,
                                },
                            },
                        },
                    }}
                    swipeAnimationDuration={SWIPE_ANIMATION_DURATION_MS}
                    stackAnimationFriction={SWIPE_SPRING.friction}
                    stackAnimationTension={SWIPE_SPRING.tension}
                    topCardResetAnimationFriction={SWIPE_SPRING.friction}
                    topCardResetAnimationTension={SWIPE_SPRING.tension}
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
                        <X color={MUTED} size={PASS_ICON_SIZE} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="w-20 h-20 rounded-full bg-primary items-center justify-center shadow-lg"
                        onPress={() => swiperRef.current?.swipeRight()}
                    >
                        <Heart color="white" fill="white" size={LIKE_ICON_SIZE} />
                    </TouchableOpacity>
                </View>
            )}

            <ConfirmModal
                visible={showLeaveModal}
                title="Leave venue?"
                message={`You'll stop seeing who's at ${venue.name} until you check in again.`}
                confirmLabel="Leave"
                destructive
                loading={leaving}
                onConfirm={confirmLeaveVenue}
                onCancel={() => setShowLeaveModal(false)}
            />
        </View>
    );
}
