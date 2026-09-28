"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAppSelector } from "../lib/hooks";
import { usePathname } from "next/navigation";
import {useShowToast} from "../hooks/showToast"

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
    const showToast = useShowToast()
    const pathname = usePathname();
    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id || user?._id;
    const [notifications, setNotifications] = useState([]);
    const playMessageSound = () => {
        const audio = new Audio("/sounds/universfield-message-notification-124467.mp3");
    
        audio.volume = 0.5;
    
        audio
            .play()
            .then(() => {
                console.log("🔊 SOUND PLAYED");
            })
            .catch((error) => {
                console.error("❌ SOUND ERROR:", error);
            });
    };
    const { socket, isConnected } = useSocket(userId);

    useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
        if (pathname.startsWith("/messages")) {
        return;
        }

        console.log("🔔 New notification:", data);

        playMessageSound();

        showToast({
        message: `New Message from ${data.message.sender.fullName}`,
        type: "info",
        });

        setNotifications((prev) => [
        ...prev,
        data,
        ]);
    };

    socket.on("notification:new", handleNotification);

    return () => {
        socket.off("notification:new", handleNotification);
    };
    }, [socket, pathname]);

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