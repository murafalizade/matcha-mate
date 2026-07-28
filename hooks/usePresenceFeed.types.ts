import { FeedProfile, MatchFoundPayload } from "@/utils/models";

export type MatchFoundHandler = (payload: MatchFoundPayload) => void;

export interface UsePresenceFeedResult {
    profiles: FeedProfile[];
    connected: boolean;
    error: string | null;
}
