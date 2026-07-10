import { Venue } from "@/utils/models";

export interface VenueContextValue {
    venue: Venue | null;
    setCheckedInVenue: (venue: Venue) => void;
    clearCheckedInVenue: () => void;
}
