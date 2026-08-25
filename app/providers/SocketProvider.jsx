"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
    const [userId, setUserId] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // هنا هات userId من Redux أو auth state
    // مثال:
    // const user = useSelector((state) => state.auth.user);
    // const userId = user?._id;

    const { socket, isConnected } = useSocket(userId);

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (data) => {
            console.log("🔔 New notification:", data);

            setNotifications((prev) => [
                ...prev,
                data,
            ]);
        };

        socket.on("notification:new", handleNotification);

        return () => {
            socket.off("notification:new", handleNotification);
        };
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
                notifications,
                setNotifications,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export const useSocketContext = () => useContext(SocketContext);