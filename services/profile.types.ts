import { FeedProfile, Gender } from "@/utils/models";

export interface ImagePickerFile {
    uri: string;
    name: string;
    type: string;
}

export interface GetFeedParams {
    limit?: number;
    cursor?: string;
}

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

export interface ProfileImageUploadResponse {
    profileImageUrl: string;
}
