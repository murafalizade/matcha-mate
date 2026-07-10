import { Gender, LookingFor } from "@/utils/models";

export interface UpdatePreferencePayload {
    minAge: number;
    maxAge: number;
    preferredGender: Gender;
    lookingFor: LookingFor[];
}

export interface PreferenceExistsResponse {
    exists: boolean;
}
