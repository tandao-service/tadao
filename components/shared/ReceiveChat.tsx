"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { subscribeToNotifications } from "@/lib/actions/usePushNotifications";

let socket: Socket;

export default function ReceiveChat({
  userId,
}: {
  userId: string;
}) {

  const [messages, setMessages] = useState<{ senderName: string; message: string }[]>([]);

  useEffect(() => {
    if (!userId) return; // Wait until user is authenticated

    socket = io(process.env.NEXT_PUBLIC_SERVER_URL); // Change to your backend URL
    socket.emit("user-online", userId);
    subscribeToNotifications(userId);
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification("New Message", { body: `${data.senderName}: ${data.message}` });
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [userId]);

  return null; // No UI needed, just handles notifications
}
