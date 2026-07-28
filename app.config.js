module.exports = {
    expo: {
        // Display name shown under the app icon. The slug stays "matchaMate"
        // because it's bound to the EAS project (extra.eas.projectId below) —
        // changing it would orphan the project linkage; it is never user-visible.
        name: "Social Coffee",
        slug: "matchaMate",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "socialcoffee",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#FFF8F0",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.seyrancodes.socialcoffee",
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
        },
        android: {
            package: "com.seyrancodes.socialcoffee",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#4A2C2A",
            },
            edgeToEdgeEnabled: true,
            config: {
                googleMaps: {
                    apiKey: process.env.GOOGLE_MAPS_API_KEY,
                },
            },
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-camera",
                {
                    cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
                },
            ],
            [
                "expo-location",
                {
                    locationWhenInUsePermission:
                        "Allow $(PRODUCT_NAME) to use your location to check you into nearby venues",
                },
            ],
            "expo-secure-store",
            "expo-localization",
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            eas: {
                projectId: "7119b4af-6a37-48dc-9ce8-be282a1565f2",
            },
        },
    },
};
