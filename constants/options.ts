import { capitalize, humanizeEnum } from "@/utils/format";
import { Gender, LookingFor } from "@/utils/models";

const GENDERS: Gender[] = ["MALE", "FEMALE", "OTHER"];
export const GENDER_OPTIONS = GENDERS.map((value) => ({
    value,
    label: capitalize(humanizeEnum(value)),
}));

const LOOKING_FOR_VALUES: LookingFor[] = [
    "ROMANTIC_RELATIONSHIP",
    "CASUAL_DATING",
    "FRIENDSHIP",
    "NETWORKING",
    "ACTIVITY_PARTNER",
    "STUDY_BUDDY",
    "LANGUAGE_EXCHANGE",
    "COFFEE_CHAT",
    "EVENTS_COMPANION",
];
export const LOOKING_FOR_OPTIONS = LOOKING_FOR_VALUES.map((value) => ({
    value,
    label: capitalize(humanizeEnum(value)),
}));
