// app/index.tsx
import { Redirect } from "expo-router";
import { useState } from "react";

export default function RootScreen() {
    // Replace with your real auth state (from context, redux, etc.)
    const [isAuth] = useState(false);

    if (isAuth) {
        return <Redirect href="/(authorized)" />;
    }
    return <Redirect href="/(unauthorized)" />;
}
