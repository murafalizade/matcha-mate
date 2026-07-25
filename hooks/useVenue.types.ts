import { Venue } from "@/utils/models";

export interface VenueContextValue {
    venue: Venue | null;
    isLoading: boolean;
    setCheckedInVenue: (venue: Venue) => void;
    clearCheckedInVenue: () => void;
}
