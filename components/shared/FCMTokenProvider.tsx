// components/FCMTokenProvider.tsx
"use client";

import { useEffect } from "react";
import { updateUserToken } from "@/lib/actions/user.actions";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { getMessaging, getToken } from "firebase/messaging";

export default function FCMTokenProvider({ userId }: { userId: string }) {
  async function registerPush(userId: string) {
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive !== "granted") {
      await PushNotifications.requestPermissions();
    }
    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token) => {
      console.log("🎯 Native FCM Token:", token.value);
      await updateUserToken(userId, token.value);
    });

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("🔔 Notification action:", notification.notification);
      }
    );
  }

  async function getFCMTokenWeb(userId: string) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return;
    }

    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
    });

    if (token) {
      console.log("🎯 Web FCM Token:", token);
      await updateUserToken(userId, token);
    } else {
      console.log("No registration token available");
    }
  }

  useEffect(() => {
    if (!userId) return;

    if (Capacitor.isNativePlatform()) {
      registerPush(userId);
    } else {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((reg) => console.log("SW registered", reg))
          .catch((err) => console.error("SW failed", err));
      }
      getFCMTokenWeb(userId);
    }
  }, [userId]);

  return null;
}
