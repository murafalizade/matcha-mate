import * as yup from "yup";

export const editProfileSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    birthDate: yup.date().required("Birthdate is required"),
    gender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
    bio: yup.string().max(500, "Max 500 characters").required("Bio is required"),
});
