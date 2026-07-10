import React, { createContext, useContext, useState } from "react";
import { Venue } from "@/utils/models";

interface VenueContextValue {
    venue: Venue | null;
    setCheckedInVenue: (venue: Venue) => void;
    clearCheckedInVenue: () => void;
}

const VenueContext = createContext<VenueContextValue | null>(null);

export function VenueProvider({ children }: { children: React.ReactNode }) {
    const [venue, setVenue] = useState<Venue | null>(null);

    return (
        <VenueContext.Provider
            value={{
                venue,
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
    if (!ctx) throw new Error("useVenue must be used within a VenueProvider");
    return ctx;
}
