import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { Socket } from "socket.io-client";

import { UsePresenceFeedResult } from "@/hooks/usePresenceFeed.types";
import { getAccessToken } from "@/utils/api";
import { FeedProfile } from "@/utils/models";
import { createSocket } from "@/utils/socket";

const HEARTBEAT_INTERVAL_MS = 30_000;

export function usePresenceFeed(venueId: string | null): UsePresenceFeedResult {
    const [profiles, setProfiles] = useState<FeedProfile[]>([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!venueId) {
            return;
        }

        let cancelled = false;

        const stopHeartbeat = () => {
            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
                heartbeatRef.current = null;
            }
        };

        const sendHeartbeat = (socket: Socket) => {
            socket.emit("heartbeat");
        };

        const connect = () => {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const socket = createSocket("/presence", token);
            socketRef.current = socket;

            socket.on("connect", () => {
                if (cancelled) {
                    return;
                }
                setConnected(true);
                setError(null);
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

            socket.on("feed_initial", (payload: { users: FeedProfile[] }) => {
                if (!cancelled) {
                    setProfiles(payload.users);
                }
            });
            socket.on("user_joined", (payload: { user: FeedProfile }) => {
                if (cancelled) {
                    return;
                }
                // Appended, not prepended — the discovery feed is a swipeable
                // deck indexed by position, so inserting at the front would
                // shift whichever card the user is currently looking at.
                setProfiles((prev) => [
                    ...(prev ?? []).filter((p) => p.id !== payload.user.id),
                    payload.user,
                ]);
            });
            socket.on("user_left", (payload: { userId: string }) => {
                if (cancelled) {
                    return;
                }
                setProfiles((prev) => (prev ?? []).filter((p) => p.id !== payload.userId));
            });

            socket.connect();

            heartbeatRef.current = setInterval(() => sendHeartbeat(socket), HEARTBEAT_INTERVAL_MS);
        };

        const disconnect = () => {
            stopHeartbeat();
            socketRef.current?.disconnect();
            socketRef.current = null;
            setConnected(false);
        };

        connect();

        // Presence is a live "who's here right now" feed — there's no point
        // holding the socket open while the app is backgrounded.
        const subscription = AppState.addEventListener("change", (state) => {
            if (state === "active" && !socketRef.current) {
                connect();
            } else if (state !== "active" && socketRef.current) {
                disconnect();
            }
        });

        return () => {
            cancelled = true;
            subscription.remove();
            disconnect();
        };
    }, [venueId]);

    return { profiles, connected, error };
}
