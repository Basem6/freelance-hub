import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = io(process.env.API_URL || "http://localhost:8080", {
            withCredentials: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        });

        const handleConnect = () => {
            setIsConnected(true);
            client.emit("userOnline", userId);
        };
        const handleDisconnect = () => setIsConnected(false);

        client.on("connect", handleConnect);
        client.on("disconnect", handleDisconnect);
        setSocket(client);

        return () => {
            client.off("connect", handleConnect);
            client.off("disconnect", handleDisconnect);
            client.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    }, [userId]);

    return { socket, isConnected };
};