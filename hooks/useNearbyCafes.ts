import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";

import { UseNearbyCafesResult } from "@/hooks/useNearbyCafes.types";
import { VenueService } from "@/services/venue";
import { NearbyCafesScreenState } from "@/types/nearby-cafes";
import { ApiError } from "@/utils/api";
import { distanceInMeters, toCoordinate } from "@/utils/geo";
import { Venue } from "@/utils/models";

const NEARBY_RADIUS_METERS = 5000;
const FETCH_RADIUS_METERS = 50000;

export function useNearbyCafes(): UseNearbyCafesResult {
    const [state, setState] = useState<NearbyCafesScreenState>("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [position, setPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                if (!cancelled) {
                    setState("location-denied");
                }
                return;
            }

            try {
                const current = await Location.getCurrentPositionAsync({});
                const here = {
                    latitude: current.coords.latitude,
                    longitude: current.coords.longitude,
                };
                const nearby = await VenueService.getNearby({
                    ...here,
                    radiusMeters: FETCH_RADIUS_METERS,
                });
                if (cancelled) {
                    return;
                }
                setPosition(here);
                setVenues(nearby);
                setState("ready");
            } catch (err) {
                if (!cancelled) {
                    setErrorMessage(
                        err instanceof ApiError ? err.message : "Failed to load nearby cafes.",
                    );
                    setState("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredVenues = useMemo(() => {
        const located = venues
            .map((v) => ({
                ...v,
                latitude: toCoordinate(v.latitude),
                longitude: toCoordinate(v.longitude),
            }))
            .filter((v) => v.latitude !== null && v.longitude !== null);
        const q = query.trim().toLowerCase();

        if (!q) {
            if (!position) {
                return located;
            }
            return located.filter(
                (v) =>
                    distanceInMeters(position, {
                        latitude: v.latitude as number,
                        longitude: v.longitude as number,
                    }) <= NEARBY_RADIUS_METERS,
            );
        }

        const matches = located.filter((v) => v.name.toLowerCase().includes(q));
        if (!position) {
            return matches;
        }
        return matches.sort(
            (a, b) =>
                distanceInMeters(position, {
                    latitude: a.latitude as number,
                    longitude: a.longitude as number,
                }) -
                distanceInMeters(position, {
                    latitude: b.latitude as number,
                    longitude: b.longitude as number,
                }),
        );
    }, [venues, query, position]);

    const distanceById = useMemo(() => {
        const map = new Map<string, number>();
        if (!position) {
            return map;
        }
        for (const venue of filteredVenues) {
            map.set(
                venue.id,
                distanceInMeters(position, {
                    latitude: venue.latitude as number,
                    longitude: venue.longitude as number,
                }),
            );
        }
        return map;
    }, [filteredVenues, position]);

    return { state, errorMessage, position, query, setQuery, filteredVenues, distanceById };
}
