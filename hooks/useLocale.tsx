import React, { createContext, useContext, useEffect, useState } from "react";

import { LocaleContextValue } from "@/hooks/useLocale.types";
import { Locale, TRANSLATIONS } from "@/i18n/translations";
import { detectDeviceLocale, isSupportedLocale } from "@/utils/locale";
import { Storage } from "@/utils/storage";

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Storage.getLocale().then((stored) => {
            if (isSupportedLocale(stored)) {
                setLocaleState(stored);
            } else {
                const detected = detectDeviceLocale();
                setLocaleState(detected);
                void Storage.setLocale(detected);
            }
            setIsLoading(false);
        });
    }, []);

    const setLocale = (next: Locale) => {
        setLocaleState(next);
        void Storage.setLocale(next);
    };

    return (
        <LocaleContext.Provider
            value={{
                locale,
                setLocale,
                t: TRANSLATIONS[locale],
                isLoading,
            }}
        >
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return ctx;
}
