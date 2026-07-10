import { RadioGroup } from "@/components/RadioGroup";
import { useLocale } from "@/hooks/useLocale";

export function LanguagePicker() {
    const { locale, setLocale, t } = useLocale();

    return (
        <RadioGroup
            options={[
                { value: "en", label: t.language.english },
                { value: "ru", label: t.language.russian },
                { value: "tr", label: t.language.turkish },
            ]}
            value={locale}
            onChange={setLocale}
        />
    );
}
