export interface CheckInPayload {
    latitude: number;
    longitude: number;
}

export interface NearbyVenuesQuery {
    latitude: number;
    longitude: number;
    radiusMeters?: number;
}
