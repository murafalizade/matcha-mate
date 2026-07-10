import React, { createContext, useContext, useEffect, useState } from "react";

import { OnboardingContextValue } from "@/hooks/useOnboarding.types";
import { Storage } from "@/utils/storage";

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Storage.getHasSeenOnboarding().then((seen) => {
            setHasSeenOnboarding(seen);
            setIsLoading(false);
        });
    }, []);

    const markOnboardingSeen = () => {
        setHasSeenOnboarding(true);
        void Storage.setHasSeenOnboarding();
    };

    return (
        <OnboardingContext.Provider value={{ hasSeenOnboarding, isLoading, markOnboardingSeen }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const ctx = useContext(OnboardingContext);
    if (!ctx) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return ctx;
}
