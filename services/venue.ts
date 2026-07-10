import { apiPost } from "@/utils/api";
import { Venue } from "@/utils/models";

export interface CheckInPayload {
    latitude: number;
    longitude: number;
}

export const VenueService = {
    checkIn(venueId: string, payload: CheckInPayload): Promise<Venue> {
        return apiPost<Venue>(`/venues/${venueId}/checkin`, payload);
    },

    checkOut(venueId: string): Promise<void> {
        return apiPost<void>(`/venues/${venueId}/checkout`);
    },
};
