export type TabBarIconName = "discovery" | "map" | "chat" | "profile";

export interface TabBarIconProps {
    name: TabBarIconName;
    focused: boolean;
}
