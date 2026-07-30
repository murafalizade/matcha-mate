import { Gender } from "@/utils/models";

export interface EditProfileFormData {
    firstName: string;
    lastName: string;
    birthDate: Date;
    gender: Gender;
    bio: string;
}
