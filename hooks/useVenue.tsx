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

    // The client only ever learns about a check-in via the QR-scan flow, so
    // without this, relaunching the app (or just a Fast Refresh) forgets it
    // even though the backend still considers the user checked in — this
    // restores that state from the server instead of always starting blank.
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
            .catch(() => {
                // Non-fatal — just starts unchecked-in, same as before this existed.
            })
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
