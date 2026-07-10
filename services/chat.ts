import { apiGet } from "@/utils/api";
import { ChatSession } from "@/utils/models";

export const ChatService = {
    getSessions(venueId?: string): Promise<ChatSession[]> {
        return apiGet<ChatSession[]>("/chat/sessions", {
            params: venueId ? { venueId } : undefined,
        });
    },
};
