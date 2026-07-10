import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api";
import { FeedProfile, Gender, Profile } from "@/utils/models";

export interface ImagePickerFile {
    uri: string;
    name: string;
    type: string;
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

    uploadImage(file: ImagePickerFile): Promise<{ profileImageUrl: string }> {
        const formData = new FormData();
        // React Native's FormData accepts a {uri, name, type} object in place
        // of a Blob — the DOM FormData type doesn't know about that shape.
        formData.append("profileImage", file as unknown as Blob);
        return apiPost<{ profileImageUrl: string }>("/profiles/me/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteImage(): Promise<void> {
        return apiDelete<void>("/profiles/me/image");
    },
};
