import {
    FeedResponse,
    GetFeedParams,
    ImagePickerFile,
    ProfileImageUploadResponse,
    UpdateProfilePayload,
} from "@/services/profile.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api";
import { Profile } from "@/utils/models";

export const ProfileService = {
    getMe(): Promise<Profile> {
        return apiGet<Profile>("/profiles/me");
    },

    // Requires an active venue check-in (400 otherwise).
    getFeed(params?: GetFeedParams): Promise<FeedResponse> {
        return apiGet<FeedResponse>("/profiles/feed", { params });
    },

    updateMe(payload: UpdateProfilePayload): Promise<Profile> {
        return apiPatch<Profile>("/profiles/me", payload);
    },

    uploadImage(file: ImagePickerFile): Promise<ProfileImageUploadResponse> {
        const formData = new FormData();
        // React Native's FormData accepts a {uri, name, type} object in place
        // of a Blob — the DOM FormData type doesn't know about that shape.
        formData.append("profileImage", file as unknown as Blob);
        return apiPost<ProfileImageUploadResponse>("/profiles/me/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteImage(): Promise<void> {
        return apiDelete<void>("/profiles/me/image");
    },
};
