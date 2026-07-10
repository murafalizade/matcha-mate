import { en } from "@/i18n/translations/en";
import { ru } from "@/i18n/translations/ru";
import { tr } from "@/i18n/translations/tr";
import { Locale, Translations } from "@/i18n/translations/types";

export const TRANSLATIONS: Record<Locale, Translations> = { en, ru, tr };
export const SUPPORTED_LOCALES: Locale[] = ["en", "ru", "tr"];

export type { Locale, Translations };
