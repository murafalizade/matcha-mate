import { CheckInPayload } from "@/services/venue.types";
import { apiPost } from "@/utils/api";
import { Venue } from "@/utils/models";

export const VenueService = {
    checkIn(venueId: string, payload: CheckInPayload): Promise<Venue> {
        return apiPost<Venue>(`/venues/${venueId}/checkin`, payload);
    },

    checkOut(venueId: string): Promise<void> {
        return apiPost<void>(`/venues/${venueId}/checkout`);
    },
};
