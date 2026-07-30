import * as yup from "yup";

import { PASSWORD_REGEX } from "@/schemas/create-profile";

export const resetPasswordSchema = yup.object({
    newPassword: yup
        .string()
        .matches(PASSWORD_REGEX, "Needs upper, lower, number & special character (@$!%*?&)")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your password"),
});
