"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function SendChat() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL); // Change to your backend URL
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = (message: string, senderName: string, userId: string, callbackUrl:string, image:string) => {
    if (socketRef.current) {
      socketRef.current.emit("newMessage", { senderName, message, userId , callbackUrl, image});
    } else {
      console.warn("Socket not initialized!");
    }
  };

  return { sendMessage }; // Return the function so you can use it in other components
}
