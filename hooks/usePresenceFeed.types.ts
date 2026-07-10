import { FeedProfile } from "@/utils/models";

export interface UsePresenceFeedResult {
    profiles: FeedProfile[];
    connected: boolean;
    error: string | null;
}
