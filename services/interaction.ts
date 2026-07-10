import { apiDelete, apiGet, apiPost } from "@/utils/api";
import { Interaction, MatchResult } from "@/utils/models";

export const InteractionService = {
    like(targetUserId: string, venueId: string): Promise<MatchResult> {
        return apiPost<MatchResult>("/interactions/like", { targetUserId, venueId });
    },

    unlike(targetUserId: string): Promise<void> {
        return apiDelete<void>(`/interactions/unlike/${targetUserId}`);
    },

    getMyLikes(): Promise<Interaction[]> {
        return apiGet<Interaction[]>("/interactions/my-likes");
    },

    getLikedMe(): Promise<Interaction[]> {
        return apiGet<Interaction[]>("/interactions/liked-me");
    },
};
