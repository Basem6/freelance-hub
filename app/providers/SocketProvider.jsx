"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { hideShow, setShow } from "../lib/Features/showSlice";

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id || user?._id;
    const [notifications, setNotifications] = useState([]);
    function showToast(message){
      dispatch(setShow(message))
      setTimeout(() => {
          dispatch(hideShow())
      }, 3000);
    } 
    // هنا هات userId من Redux أو auth state
    // مثال:
    // const user = useSelector((state) => state.auth.user);
    // const userId = user?._id;
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
            console.log("🔔 New notification:", data);
            playMessageSound  ()
            showToast({ message: `New Message from ${data.message.sender.fullName}`, type: "info" });
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