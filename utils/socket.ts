import { io, Socket } from "socket.io-client";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";

export function createSocket(namespace: "/presence" | "/chat", token: string): Socket {
    return io(`${API_BASE_URL}${namespace}`, {
        auth: { token },
        transports: ["websocket"],
        autoConnect: false,
    });
}
