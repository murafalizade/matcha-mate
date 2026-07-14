import { NearbyCafesScreenState } from "@/types/nearby-cafes";

export interface NearbyCafesStatusProps {
    state: Exclude<NearbyCafesScreenState, "ready">;
    errorMessage: string | null;
}
