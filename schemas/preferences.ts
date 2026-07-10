import * as yup from "yup";

export const preferencesSchema = yup.object({
    minAge: yup
        .string()
        .matches(/^\d+$/, "Must be a number")
        .test("range", "Must be between 18 and 100", (v) => !!v && +v >= 18 && +v <= 100)
        .required("Required"),
    maxAge: yup
        .string()
        .matches(/^\d+$/, "Must be a number")
        .test("range", "Must be between 18 and 100", (v) => !!v && +v >= 18 && +v <= 100)
        .test("gte-min", "Must be ≥ min age", function (v) {
            return !!v && +v >= +this.parent.minAge;
        })
        .required("Required"),
    preferredGender: yup.string().oneOf(["MALE", "FEMALE", "OTHER"]).required(),
    lookingFor: yup.array().min(1, "Pick at least one").required(),
});
