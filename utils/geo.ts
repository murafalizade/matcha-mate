const EARTH_RADIUS_METERS = 6371000;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function distanceInMeters(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number },
): number {
    const dLat = toRadians(to.latitude - from.latitude);
    const dLon = toRadians(to.longitude - from.longitude);
    const lat1 = toRadians(from.latitude);
    const lat2 = toRadians(to.latitude);

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_METERS * c;
}

export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m away`;
    }
    return `${(meters / 1000).toFixed(1)} km away`;
}
