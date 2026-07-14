import { useRef } from "react";
import { FlatList, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

import { CafeCard, CAFE_CARD_WIDTH } from "@/components/CafeCard";
import { CafeMarker } from "@/components/CafeMarker";
import { NearbyCafesMapViewProps } from "@/components/NearbyCafesMapView/types";
import { WARM_MAP_STYLE } from "@/constants/mapStyle";
import { formatDistance } from "@/utils/geo";
import { Venue } from "@/utils/models";

const CARD_GAP = 16;

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
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            },
            300,
        );
        carouselRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    };

    const initialRegion: Region = {
        latitude: position?.latitude ?? 0,
        longitude: position?.longitude ?? 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

    return (
        <View className="flex-1 -mt-2">
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                provider={PROVIDER_GOOGLE}
                customMapStyle={WARM_MAP_STYLE}
                initialRegion={initialRegion}
                showsUserLocation
            >
                {filteredVenues.map((venue) => (
                    <Marker
                        key={venue.id}
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
