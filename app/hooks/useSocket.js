import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let disposed = false;
        let client;

        const connect = async () => {
            try {
                const response = await fetch(
                    "/api/auth/socket-token",
                    {
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                if (!response.ok || disposed) return;

                const { token } = await response.json();

                if (!token || disposed) return;

                client = io(
                        process.env.NEXT_PUBLIC_API_UR||
                        "http://localhost:8080",
                    {
                        auth: { token },
                        withCredentials: true,
                        transports: ["polling", "websocket"],
                        reconnection: true,
                        reconnectionDelay: 1000,
                        reconnectionDelayMax: 5000,
                        reconnectionAttempts: Infinity,
                    }
                );

                const handleConnect = () => {
                    console.log("🟢 Socket connected:", client.id);
                    setIsConnected(true);
                };

                const handleDisconnect = () => {
                    console.log("🔴 Socket disconnected");
                    setIsConnected(false);
                };

                const handleConnectError = (error) => {
                    console.error(
                        "❌ Socket connection error:",
                        error.message
                    );
                    setIsConnected(false);
                };

                client.on("connect", handleConnect);
                client.on("disconnect", handleDisconnect);
                client.on("connect_error", handleConnectError);

                setSocket(client);
            } catch (error) {
                if (!disposed) {
                    console.error(
                        "Socket authentication error:",
                        error.message
                    );
                }
            }
        };

        connect();

        return () => {
            disposed = true;

            client?.removeAllListeners();
            client?.disconnect();

            setSocket(null);
            setIsConnected(false);
        };
    }, [userId]);

    return {
        socket,
        isConnected,
    };
};