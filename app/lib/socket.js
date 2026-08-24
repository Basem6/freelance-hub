import { io } from "socket.io-client";

export const socket = io("https://hemma-psi.vercel.app", {
autoConnect: false,
withCredentials: true,
});
