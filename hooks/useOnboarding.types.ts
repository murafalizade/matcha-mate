export interface OnboardingContextValue {
    hasSeenOnboarding: boolean;
    isLoading: boolean;
    markOnboardingSeen: () => void;
}
