export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Role = "USER" | "ADMIN" | "CAFE_MANAGER";
export type ChatSessionStatus = "PENDING" | "ACTIVE" | "ENDED" | "EXPIRED";
export type VenueStatus = "ACTIVE" | "TEMPORARILY_CLOSED" | "PERMANENTLY_CLOSED";
export type LookingFor =
    | "ROMANTIC_RELATIONSHIP"
    | "CASUAL_DATING"
    | "FRIENDSHIP"
    | "NETWORKING"
    | "ACTIVITY_PARTNER"
    | "STUDY_BUDDY"
    | "LANGUAGE_EXCHANGE"
    | "COFFEE_CHAT"
    | "EVENTS_COMPANION";

export interface Interest {
    id: string;
    name: string;
}

export interface Preference {
    id?: string;
    userId?: string;
    minAge: number;
    maxAge: number;
    preferredGender: Gender | null;
    lookingFor: LookingFor[] | null;
}

// Matches UserResponseDto — returned by auth endpoints
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    role: Role;
    profileImageUrl: string | null;
    bio: string;
    birthDate: string;
    createdAt: string;
}

// Matches ProfileResponseDto — GET/PATCH /profiles/me
export interface Profile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: Gender;
    profileImageUrl: string | null;
    bio: string | null;
    interests: Interest[];
    preference: Preference | null;
    createdAt: string;
    updatedAt: string;
}

// Matches ProfileForFeedDto — GET /profiles/feed
export interface FeedProfile {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: Gender;
    bio: string | null;
    profileImageUrl: string | null;
    interests: Interest[];
    lookingFor: LookingFor[] | null;
}

export interface Venue {
    id: string;
    name: string;
    mapUrl: string;
    latitude: number | null;
    longitude: number | null;
    geofenceMeters: number;
    status: VenueStatus;
    createdAt: string;
    updatedAt: string;
}

export interface VenueWithQrCode extends Venue {
    qrCode: string;
}

export interface InteractionUser {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
}

export interface Interaction {
    id: string;
    venueId: string;
    user: InteractionUser;
    createdAt: string;
}

export interface MatchPartner {
    id: string;
    firstName: string;
    lastName: string;
}

export interface MatchChatSession {
    id: string;
    expiresAt: string;
    partner: MatchPartner;
}

export interface MatchResult {
    matched: boolean;
    chatSession?: MatchChatSession;
}

export interface ChatSession {
    id: string;
    status: ChatSessionStatus;
    startedAt: string;
    expiresAt: string;
    partner: MatchPartner;
    venue: { id: string; name: string };
}

export interface ChatMessage {
    id: string;
    chatSessionId: string;
    senderId: string;
    content: string;
    createdAt: string;
}
