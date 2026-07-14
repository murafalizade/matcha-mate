import { CheckInPayload, NearbyVenuesQuery } from "@/services/venue.types";
import { apiGet, apiPost } from "@/utils/api";
import { Venue } from "@/utils/models";

export const VenueService = {
    checkIn(venueId: string, payload: CheckInPayload): Promise<Venue> {
        return apiPost<Venue>(`/venues/${venueId}/checkin`, payload);
    },

    checkOut(venueId: string): Promise<void> {
        return apiPost<void>(`/venues/${venueId}/checkout`);
    },

    getNearby(query: NearbyVenuesQuery): Promise<Venue[]> {
        return apiGet<Venue[]>("/venues/nearby", { params: query });
    },
};
