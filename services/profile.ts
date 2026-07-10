import { apiGet, apiPatch } from "@/utils/api";
import { FeedProfile, Gender, Profile } from "@/utils/models";

export interface FeedResponse {
    profiles: FeedProfile[];
    total: number;
    nextCursor: string | null;
    hasMore: boolean;
}

export interface UpdateProfilePayload {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    gender?: Gender;
    bio?: string;
    interestIds?: string[];
}

export const ProfileService = {
    getMe(): Promise<Profile> {
        return apiGet<Profile>("/profiles/me");
    },

    // Requires an active venue check-in (400 otherwise).
    getFeed(params?: { limit?: number; cursor?: string }): Promise<FeedResponse> {
        return apiGet<FeedResponse>("/profiles/feed", { params });
    },

    updateMe(payload: UpdateProfilePayload): Promise<Profile> {
        return apiPatch<Profile>("/profiles/me", payload);
    },
};
