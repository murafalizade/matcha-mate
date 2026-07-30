import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, View } from "react-native";

import { PRIVACY_POLICY_URL, SAFETY_GUIDELINES_URL, TERMS_OF_SERVICE_URL } from "@/constants/legal";
import { useLocale } from "@/hooks/useLocale";

export function LegalLinks() {
    const { t } = useLocale();

    const links = [
        { label: t.legal.privacyPolicy, url: PRIVACY_POLICY_URL },
        { label: t.legal.termsOfService, url: TERMS_OF_SERVICE_URL },
        { label: t.legal.safetyGuidelines, url: SAFETY_GUIDELINES_URL },
    ];

    return (
        <View className="flex-row items-center justify-center flex-wrap">
            {links.map((link, index) => (
                <View key={link.url} className="flex-row items-center">
                    {index > 0 && <Text className="text-muted text-xs mx-1.5">·</Text>}
                    <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(link.url)}>
                        <Text className="text-caramel text-xs font-medium">{link.label}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}
