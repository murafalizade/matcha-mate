import { Gender } from "@/utils/models";

export interface CreateProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: Date;
    gender: Gender;
    bio: string;
}
