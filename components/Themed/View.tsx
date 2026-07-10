import { View as DefaultView } from "react-native";

import { ViewProps } from "@/components/Themed/types";
import { useThemeColor } from "@/hooks/useThemeColor";

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
