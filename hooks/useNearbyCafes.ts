import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";

import { UseNearbyCafesResult } from "@/hooks/useNearbyCafes.types";
import { VenueService } from "@/services/venue";
import { NearbyCafesScreenState } from "@/types/nearby-cafes";
import { ApiError } from "@/utils/api";
import { distanceInMeters } from "@/utils/geo";
import { Venue } from "@/utils/models";

const SEARCH_RADIUS_METERS = 5000;

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
                    radiusMeters: SEARCH_RADIUS_METERS,
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
        const located = venues.filter((v) => v.latitude !== null && v.longitude !== null);
        const q = query.trim().toLowerCase();
        if (!q) {
            return located;
        }
        return located.filter((v) => v.name.toLowerCase().includes(q));
    }, [venues, query]);

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
