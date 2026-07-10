// "ROMANTIC_RELATIONSHIP" -> "romantic relationship"
export function humanizeEnum(value: string): string {
    return value.replace(/_/g, " ").toLowerCase();
}
