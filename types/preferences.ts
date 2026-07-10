import { Gender, LookingFor } from "@/utils/models";

export interface PreferencesFormData {
    minAge: string;
    maxAge: string;
    preferredGender: Gender;
    lookingFor: LookingFor[];
}
