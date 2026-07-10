// "ROMANTIC_RELATIONSHIP" -> "romantic relationship"
export function humanizeEnum(value: string): string {
    return value.replace(/_/g, " ").toLowerCase();
}

// "ROMANTIC_RELATIONSHIP" -> "Romantic relationship"
export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function calculateAge(birthDate: string): number {
    const diff = Date.now() - new Date(birthDate).getTime();
    return new Date(diff).getUTCFullYear() - 1970;
}
