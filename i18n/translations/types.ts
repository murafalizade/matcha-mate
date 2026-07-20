export interface Translations {
    common: {
        next: string;
        skip: string;
        getStarted: string;
        back: string;
        genericError: string;
        continue: string;
    };
    onboarding: {
        slide1Title: string;
        slide1Body: string;
        slide2Title: string;
        slide2Body: string;
        slide3Title: string;
        slide3Body: string;
    };
    welcome: {
        title: string;
        brand: string;
        subtitle: string;
        createAccount: string;
        logIn: string;
        terms: string;
    };
    login: {
        title: string;
        subtitle: string;
        email: string;
        emailPlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        forgotPassword: string;
        logIn: string;
        noAccount: string;
        signUp: string;
    };
    createProfile: {
        title: string;
        pickImage: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        birthdate: string;
        selectDate: string;
        gender: string;
        male: string;
        female: string;
        other: string;
        bio: string;
        bioPlaceholder: string;
        agreeTerms: string;
        createProfile: string;
        alreadyHaveAccount: string;
        agreementRequiredTitle: string;
        agreementRequiredBody: string;
        registrationFailedTitle: string;
    };
    language: {
        title: string;
        english: string;
        russian: string;
        turkish: string;
    };
}

export type Locale = "en" | "ru" | "tr";
