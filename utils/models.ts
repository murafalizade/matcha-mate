type Gender = "male" | "female" | "other";
type LookingFor = "relations" | "friendship" | "study mate";


export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: number;
    preferences: Preference;
}

export interface Preference {
    gender: Gender;
    preferredGender: Gender;
    lookingFor: LookingFor;
    description: string;
}
