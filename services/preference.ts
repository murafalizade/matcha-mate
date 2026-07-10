import { apiDelete, apiGet, apiPut } from "@/utils/api";
import { Gender, LookingFor, Preference } from "@/utils/models";

export interface UpdatePreferencePayload {
    minAge: number;
    maxAge: number;
    preferredGender: Gender;
    lookingFor: LookingFor[];
}

export const PreferenceService = {
    exists(): Promise<{ exists: boolean }> {
        return apiGet<{ exists: boolean }>("/preferences/me/exists");
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
