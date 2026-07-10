import { Gender } from "@/utils/models";

// Interests aren't editable here: PATCH /profiles/me accepts interestIds,
// but there's no endpoint to list the available Interest catalog to pick
// from, so there's nothing to build a picker against yet.
export interface EditProfileFormData {
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: Gender;
    bio: string;
}
