import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NearbyCafesHeader } from "@/components/NearbyCafesHeader";
import { NearbyCafesMapView } from "@/components/NearbyCafesMapView";
import { NearbyCafesStatus } from "@/components/NearbyCafesStatus";
import { useNearbyCafes } from "@/hooks/useNearbyCafes";
import { Venue } from "@/utils/models";

export default function NearbyCafesScreen() {
    const { state, errorMessage, position, query, setQuery, filteredVenues, distanceById } =
        useNearbyCafes();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (state !== "ready") {
        return <NearbyCafesStatus state={state} errorMessage={errorMessage} />;
    }

    return (
        <View className="flex-1 bg-cream">
            <SafeAreaView edges={["top"]} className="z-10">
                <NearbyCafesHeader query={query} onQueryChange={setQuery} />
            </SafeAreaView>

            <NearbyCafesMapView
                position={position}
                filteredVenues={filteredVenues}
                distanceById={distanceById}
                selectedId={selectedId}
                onSelectVenue={(venue: Venue) => setSelectedId(venue.id)}
            />
        </View>
    );
}
