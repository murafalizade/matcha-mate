import { PreferenceExistsResponse, UpdatePreferencePayload } from "@/services/preference.types";
import { apiDelete, apiGet, apiPut } from "@/utils/api";
import { Preference } from "@/utils/models";

export const PreferenceService = {
    exists(): Promise<PreferenceExistsResponse> {
        return apiGet<PreferenceExistsResponse>("/preferences/me/exists");
    },

    getMe(): Promise<Preference> {
        return apiGet<Preference>("/preferences/me");
    },

    updateMe(payload: UpdatePreferencePayload): Promise<Preference> {
        return apiPut<Preference>("/preferences/me", payload);
    },

    removeMe(): Promise<void> {
        return apiDelete<void>("/preferences/me");
    },
};
