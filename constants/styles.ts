import { ESPRESSO } from "@/constants/colors";

export const CARD_SHADOW = {
    shadowColor: ESPRESSO,
    shadowOpacity: 0.08,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
};

export const INPUT_ICON_LEFT = {
    position: "absolute" as const,
    left: 16,
    zIndex: 1,
};

export const INPUT_ICON_RIGHT = {
    position: "absolute" as const,
    right: 16,
    zIndex: 1,
};
