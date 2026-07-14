import { FlatList, Text } from "react-native";

import { CafeCard } from "@/components/CafeCard";
import { NearbyCafesMapViewProps } from "@/components/NearbyCafesMapView/types";
import { formatDistance } from "@/utils/geo";

// react-native-maps has no web implementation, so this universal/default
// variant (used on web) renders the same real venue data as a plain list.
// index.native.tsx overrides it on iOS/Android with the real MapView.
export function NearbyCafesMapView({
    filteredVenues,
    distanceById,
    selectedId,
    onSelectVenue,
}: NearbyCafesMapViewProps) {
    return (
        <FlatList
            data={filteredVenues}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            ListEmptyComponent={
                <Text className="text-center text-muted mt-10">No cafes found nearby.</Text>
            }
            renderItem={({ item }) => (
                <CafeCard
                    venue={item}
                    distanceLabel={
                        distanceById.has(item.id)
                            ? formatDistance(distanceById.get(item.id) as number)
                            : null
                    }
                    selected={item.id === selectedId}
                    onPress={() => onSelectVenue(item)}
                />
            )}
        />
    );
}
