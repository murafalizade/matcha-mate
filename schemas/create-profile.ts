import * as yup from "yup";

// Mirrors the backend's password/name/bio rules (see auth/constants/validation)
// so the client rejects the same input the server would, instead of a round-trip 400.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export const createProfileSchema = yup.object({
    firstName: yup
        .string()
        .trim()
        .min(2, "Min 2 characters")
        .max(50, "Max 50 characters")
        .matches(NAME_REGEX, "Letters, spaces, ' and - only")
        .required("First name is required"),
    lastName: yup
        .string()
        .trim()
        .min(2, "Min 2 characters")
        .max(50, "Max 50 characters")
        .matches(NAME_REGEX, "Letters, spaces, ' and - only")
        .required("Last name is required"),
    email: yup.string().email("Invalid email").max(255).required("Email is required"),
    password: yup
        .string()
        .matches(PASSWORD_REGEX, "Needs upper, lower, number & special character (@$!%*?&)")
        .required("Password is required"),
    birthDate: yup.date().required("Birthdate is required"),
    gender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
    bio: yup
        .string()
        .min(10, "Min 10 characters")
        .max(500, "Max 500 characters")
        .required("Bio is required"),
});
