import { ChatMessage, ChatSession } from "@/utils/models";

export type EndReason = "chat_ended" | "session_expired" | "partner_left";

export interface UseChatSessionResult {
    session: ChatSession | null;
    messages: ChatMessage[];
    partnerTyping: boolean;
    connected: boolean;
    error: string | null;
    endedReason: EndReason | null;
    endedBy: string | null;
    minutesLeft: number | null;
    sendMessage: (content: string) => void;
    setTyping: (isTyping: boolean) => void;
    endChat: () => void;
}
