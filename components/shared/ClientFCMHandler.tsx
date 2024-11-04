"use client";
import { useEffect } from "react";
//import { requestPermission, onMessageListener } from "@/lib/firebase";

const ClientFCMHandler = () => {
  useEffect(() => {
    //requestPermission();
    // onMessageListener()
    // .then((payload) => {
    //   console.log("Message received. ", payload);
    //   alert("New message: " + payload.notification.title);
    // })
    // .catch((err) => console.log("failed: ", err));
  }, []);

  return null; // This component doesn't render anything visible
};

export default ClientFCMHandler;
