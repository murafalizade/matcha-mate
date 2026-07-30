import {
    FeedResponse,
    GetFeedParams,
    ImagePickerFile,
    ProfileImageUploadResponse,
    UpdateProfilePayload,
} from "@/services/profile.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api";
import { Interest, Profile } from "@/utils/models";

export const ProfileService = {
    getMe(): Promise<Profile> {
        return apiGet<Profile>("/profiles/me");
    },

    getInterests(): Promise<Interest[]> {
        return apiGet<Interest[]>("/profiles/interests");
    },

    getFeed(params?: GetFeedParams): Promise<FeedResponse> {
        return apiGet<FeedResponse>("/profiles/feed", { params });
    },

    updateMe(payload: UpdateProfilePayload): Promise<Profile> {
        return apiPatch<Profile>("/profiles/me", payload);
    },

    uploadImage(file: ImagePickerFile): Promise<ProfileImageUploadResponse> {
        const formData = new FormData();
        formData.append("profileImage", file as unknown as Blob);
        return apiPost<ProfileImageUploadResponse>("/profiles/me/image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteImage(): Promise<void> {
        return apiDelete<void>("/profiles/me/image");
    },
};
