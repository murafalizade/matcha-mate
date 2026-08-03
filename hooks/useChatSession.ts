import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import { EndReason, UseChatSessionResult } from "@/hooks/useChatSession.types";
import { getAccessToken } from "@/utils/api";
import { ChatMessage, ChatSession } from "@/utils/models";
import { createSocket } from "@/utils/socket";

export function useChatSession(chatSessionId: string | null): UseChatSessionResult {
    const [session, setSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [partnerTyping, setPartnerTyping] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [endedReason, setEndedReason] = useState<EndReason | null>(null);
    const [endedBy, setEndedBy] = useState<string | null>(null);
    const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!chatSessionId) {
            return;
        }
        let cancelled = false;

        const token = getAccessToken();
        if (!token) {
            return;
        }

        const socket = createSocket("/chat", token);
        socketRef.current = socket;

        socket.on("connect", () => {
            if (cancelled) {
                return;
            }
            setConnected(true);
            setError(null);
            socket.emit("join_chat", { chatSessionId });
        });
        socket.on("disconnect", () => {
            if (!cancelled) {
                setConnected(false);
            }
        });
        socket.on("connect_error", (err) => {
            if (!cancelled) {
                setError(err.message);
            }
        });
        socket.on("error", (payload: { message: string }) => {
            if (!cancelled) {
                setError(payload.message);
            }
        });

        socket.on(
            "chat_joined",
            (payload: { chatSessionId: string; messages: ChatMessage[]; session: ChatSession }) => {
                if (cancelled || payload.chatSessionId !== chatSessionId) {
                    return;
                }
                setMessages(payload.messages);
                setSession(payload.session);
            },
        );

        socket.on(
            "countdown_started",
            (payload: { chatSessionId: string; startedAt: string; expiresAt: string }) => {
                if (cancelled || payload.chatSessionId !== chatSessionId) {
                    return;
                }
                setSession((prev) =>
                    prev
                        ? {
                              ...prev,
                              status: "ACTIVE",
                              startedAt: payload.startedAt,
                              expiresAt: payload.expiresAt,
                          }
                        : prev,
                );
            },
        );

        socket.on("message", (message: ChatMessage) => {
            if (cancelled || message.chatSessionId !== chatSessionId) {
                return;
            }
            setMessages((prev) => [...prev, message]);
        });

        socket.on("partner_typing", (payload: { isTyping: boolean }) => {
            if (!cancelled) {
                setPartnerTyping(payload.isTyping);
            }
        });

        socket.on("session_ending_soon", (payload: { minutesLeft: number }) => {
            if (!cancelled) {
                setMinutesLeft(payload.minutesLeft);
            }
        });
        socket.on("chat_ended", (payload: { endedBy?: string }) => {
            if (!cancelled) {
                setEndedBy(payload?.endedBy ?? null);
                setEndedReason("chat_ended");
            }
        });
        socket.on("session_expired", () => {
            if (!cancelled) {
                setEndedReason("session_expired");
            }
        });
        socket.on("partner_left", () => {
            if (!cancelled) {
                setEndedReason("partner_left");
            }
        });

        socket.connect();

        return () => {
            cancelled = true;
            socket.disconnect();
            socketRef.current = null;
        };
    }, [chatSessionId]);

    const sendMessage = (content: string) => {
        if (!chatSessionId) {
            return;
        }
        socketRef.current?.emit("send_message", { chatSessionId, content });
    };

    const setTyping = (isTyping: boolean) => {
        if (!chatSessionId) {
            return;
        }
        socketRef.current?.emit("typing", { chatSessionId, isTyping });
    };

    const endChat = () => {
        if (!chatSessionId) {
            return;
        }
        socketRef.current?.emit("end_chat", { chatSessionId });
    };

    return {
        session,
        messages,
        partnerTyping,
        connected,
        error,
        endedReason,
        endedBy,
        minutesLeft,
        sendMessage,
        setTyping,
        endChat,
    };
}
