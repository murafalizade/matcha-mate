import { Locale, Translations } from "@/i18n/translations";

export interface LocaleContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
    isLoading: boolean;
}
