import { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { CafeCard, CAFE_CARD_WIDTH } from "@/components/CafeCard";
import { CafeMarker } from "@/components/CafeMarker";
import { NearbyCafesMapViewProps } from "@/components/NearbyCafesMapView/types";
import { WARM_MAP_STYLE } from "@/constants/mapStyle";
import { CARD_SHADOW } from "@/constants/styles";
import { formatDistance } from "@/utils/geo";
import { Venue } from "@/utils/models";

const CARD_GAP = 16;
const FOCUS_ZOOM_DELTA = 0.01;
const INITIAL_ZOOM_DELTA = 0.02;
const FOCUS_ANIMATION_DURATION_MS = 300;
const CAROUSEL_SCROLL_VIEW_POSITION = 0.5;
const FIT_EDGE_PADDING_INITIAL = { top: 80, right: 60, bottom: 220, left: 60 };
const FIT_EDGE_PADDING_SEARCH = { top: 80, right: 80, bottom: 260, left: 80 };
const MARKER_REFRESH_TIMEOUT_MS = 800;

export function NearbyCafesMapView({
    position,
    filteredVenues,
    distanceById,
    selectedId,
    onSelectVenue,
}: NearbyCafesMapViewProps) {
    const mapRef = useRef<MapView>(null);
    const carouselRef = useRef<FlatList<Venue>>(null);

    const focusVenue = (venue: Venue, index: number) => {
        onSelectVenue(venue);
        mapRef.current?.animateToRegion(
            {
                latitude: venue.latitude as number,
                longitude: venue.longitude as number,
                latitudeDelta: FOCUS_ZOOM_DELTA,
                longitudeDelta: FOCUS_ZOOM_DELTA,
            },
            FOCUS_ANIMATION_DURATION_MS,
        );
        carouselRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: CAROUSEL_SCROLL_VIEW_POSITION,
        });
    };

    const fitToVenues = () => {
        if (filteredVenues.length === 0) {
            return;
        }
        mapRef.current?.fitToCoordinates(
            filteredVenues.map((venue) => ({
                latitude: venue.latitude as number,
                longitude: venue.longitude as number,
            })),
            {
                edgePadding: FIT_EDGE_PADDING_INITIAL,
                animated: false,
            },
        );
    };

    const initialRegion: Region = {
        latitude: position?.latitude ?? 0,
        longitude: position?.longitude ?? 0,
        latitudeDelta: INITIAL_ZOOM_DELTA,
        longitudeDelta: INITIAL_ZOOM_DELTA,
    };

    const resultKey = filteredVenues.map((v) => v.id).join(",");
    useEffect(() => {
        if (filteredVenues.length === 0) {
            return;
        }
        mapRef.current?.fitToCoordinates(
            filteredVenues.map((venue) => ({
                latitude: venue.latitude as number,
                longitude: venue.longitude as number,
            })),
            {
                edgePadding: FIT_EDGE_PADDING_SEARCH,
                animated: true,
            },
        );
        carouselRef.current?.scrollToOffset({ offset: 0, animated: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultKey]);

    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    useEffect(() => {
        setTracksViewChanges(true);
        const timer = setTimeout(() => setTracksViewChanges(false), MARKER_REFRESH_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [resultKey, selectedId]);

    return (
        <View className="flex-1 -mt-2">
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={WARM_MAP_STYLE}
                initialRegion={initialRegion}
                showsUserLocation
                onMapReady={fitToVenues}
            >
                {filteredVenues.map((venue) => (
                    <Marker
                        key={venue.id}
                        tracksViewChanges={tracksViewChanges}
                        coordinate={{
                            latitude: venue.latitude as number,
                            longitude: venue.longitude as number,
                        }}
                        onPress={() =>
                            focusVenue(
                                venue,
                                filteredVenues.findIndex((v) => v.id === venue.id),
                            )
                        }
                    >
                        <CafeMarker name={venue.name} selected={venue.id === selectedId} />
                    </Marker>
                ))}
            </MapView>

            {filteredVenues.length === 0 && (
                <View className="absolute bottom-6 left-0 w-full px-6">
                    <View className="bg-white rounded-2xl px-5 py-4" style={CARD_SHADOW}>
                        <Text className="text-ink font-semibold text-center">No cafes found</Text>
                        <Text className="text-muted text-sm text-center mt-1">
                            Try a different name, or clear the search to see cafes near you.
                        </Text>
                    </View>
                </View>
            )}

            <View className="absolute bottom-6 left-0 w-full">
                <FlatList
                    ref={carouselRef}
                    data={filteredVenues}
                    horizontal
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CAFE_CARD_WIDTH + CARD_GAP}
                    decelerationRate="fast"
                    contentContainerStyle={{ paddingHorizontal: 24, gap: CARD_GAP }}
                    getItemLayout={(_, index) => ({
                        length: CAFE_CARD_WIDTH + CARD_GAP,
                        offset: (CAFE_CARD_WIDTH + CARD_GAP) * index,
                        index,
                    })}
                    renderItem={({ item, index }) => (
                        <CafeCard
                            venue={item}
                            distanceLabel={
                                distanceById.has(item.id)
                                    ? formatDistance(distanceById.get(item.id) as number)
                                    : null
                            }
                            selected={item.id === selectedId}
                            onPress={() => focusVenue(item, index)}
                        />
                    )}
                />
            </View>
        </View>
    );
}
