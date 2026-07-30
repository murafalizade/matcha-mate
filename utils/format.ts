export function humanizeEnum(value: string): string {
    return value.replace(/_/g, " ").toLowerCase();
}

export function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function calculateAge(birthDate: string): number {
    const diff = Date.now() - new Date(birthDate).getTime();
    return new Date(diff).getUTCFullYear() - 1970;
}

export function formatCountdown(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}
