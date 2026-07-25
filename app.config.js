module.exports = {
    expo: {
        name: "matchaMate",
        slug: "matchaMate",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "matchamate",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        splash: {
            image: "./assets/images/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            supportsTablet: true,
            config: {
                googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
            },
        },
        android: {
            package: "com.seyrancodes.matchamate",
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#ffffff",
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
