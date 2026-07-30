import * as Localization from "expo-localization";

import { Locale, SUPPORTED_LOCALES } from "@/i18n/translations";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

export function detectDeviceLocale(): Locale {
    const languageCode = Localization.getLocales()[0]?.languageCode;
    return isSupportedLocale(languageCode) ? languageCode : "en";
}
