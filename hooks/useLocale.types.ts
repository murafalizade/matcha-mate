import { Locale, Translations } from "@/i18n/translations";

export interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    // Distinct from `isLoading`/`locale` (which always has a value, even if
    // just device-detected) — tracks whether the user has actually confirmed
    // a choice on the language screen, gating that screen in the boot flow.
    hasChosenLanguage: boolean;
    confirmLanguage: (locale: Locale) => void;
    t: Translations;
    isLoading: boolean;
}
