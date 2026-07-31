import * as Location from "expo-location";

const MAX_ACCEPTABLE_ACCURACY_METERS = 75;
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 300;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAccurateLocation(): Promise<Location.LocationObject> {
    let best: Location.LocationObject | null = null;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        if (attempt > 0) {
            await sleep(RETRY_DELAY_MS);
        }

        const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });

        if (!best || (position.coords.accuracy ?? Infinity) < (best.coords.accuracy ?? Infinity)) {
            best = position;
        }

        if ((position.coords.accuracy ?? Infinity) <= MAX_ACCEPTABLE_ACCURACY_METERS) {
            break;
        }
    }

    return best as Location.LocationObject;
}
