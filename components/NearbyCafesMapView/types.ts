import { Venue } from "@/utils/models";

export interface NearbyCafesMapViewProps {
    position: { latitude: number; longitude: number } | null;
    filteredVenues: Venue[];
    distanceById: Map<string, number>;
    selectedId: string | null;
    onSelectVenue: (venue: Venue) => void;
}
