import React, { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { VenueContextValue } from "@/hooks/useVenue.types";
import { VenueService } from "@/services/venue";
import { Venue } from "@/utils/models";

const VenueContext = createContext<VenueContextValue | null>(null);

export function VenueProvider({ children }: { children: React.ReactNode }) {
    const { isAuth, isLoading: isAuthLoading } = useAuth();
    const [venue, setVenue] = useState<Venue | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isAuth) {
            setVenue(null);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        VenueService.getCurrentCheckIn()
            .then((current) => {
                if (!cancelled) {
                    setVenue(current);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [isAuth, isAuthLoading]);

    return (
        <VenueContext.Provider
            value={{
                venue,
                isLoading,
                setCheckedInVenue: setVenue,
                clearCheckedInVenue: () => setVenue(null),
            }}
        >
            {children}
        </VenueContext.Provider>
    );
}

export function useVenue() {
    const ctx = useContext(VenueContext);
    if (!ctx) {
        throw new Error("useVenue must be used within a VenueProvider");
    }
    return ctx;
}
