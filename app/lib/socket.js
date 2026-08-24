import { io } from "socket.io-client";

export const socket = io("https://hemma-production-fbbd.up.railway.app", {
autoConnect: false,
withCredentials: true,
});
