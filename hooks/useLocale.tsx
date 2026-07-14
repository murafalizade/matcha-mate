import * as Localization from "expo-localization";
import React, { createContext, useContext, useEffect, useState } from "react";

import { LocaleContextValue } from "@/hooks/useLocale.types";
import { Locale, SUPPORTED_LOCALES, TRANSLATIONS } from "@/i18n/translations";
import { Storage } from "@/utils/storage";

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isSupportedLocale(value: string | null | undefined): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectDeviceLocale(): Locale {
    const languageCode = Localization.getLocales()[0]?.languageCode;
    return isSupportedLocale(languageCode) ? languageCode : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("en");
    const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([Storage.getLocale(), Storage.getHasChosenLanguage()]).then(
            ([stored, chosen]) => {
                setLocaleState(isSupportedLocale(stored) ? stored : detectDeviceLocale());
                setHasChosenLanguage(chosen);
                setIsLoading(false);
            },
        );
    }, []);

    const setLocale = (next: Locale) => {
        setLocaleState(next);
        void Storage.setLocale(next);
    };

    const confirmLanguage = (next: Locale) => {
        setLocale(next);
        setHasChosenLanguage(true);
        void Storage.setHasChosenLanguage();
    };

    return (
        <LocaleContext.Provider
            value={{
                locale,
                setLocale,
                hasChosenLanguage,
                confirmLanguage,
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
