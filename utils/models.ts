type Gender = "male" | "female" | "other";
type LookingFor = "relations" | "friendship" | "study mate";


export interface User {
    id: string;
    pictureUrl: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    gender: Gender;
    preferences: Preference;
    birthdate: Date;
    interests: string;
    bio: string;
}

export interface Preference {
    preferredGender: Gender;
    lookingFor: LookingFor;
    description: string;
}
