import { NearbyCafesScreenState } from "@/types/nearby-cafes";
import { Venue } from "@/utils/models";

export interface UseNearbyCafesResult {
    state: NearbyCafesScreenState;
    errorMessage: string | null;
    position: { latitude: number; longitude: number } | null;
    query: string;
    setQuery: (query: string) => void;
    filteredVenues: Venue[];
    distanceById: Map<string, number>;
}
