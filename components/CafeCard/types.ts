import { Venue } from "@/utils/models";

export interface CafeCardProps {
    venue: Venue;
    distanceLabel: string | null;
    selected: boolean;
    onPress: () => void;
}
