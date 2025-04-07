// firebase-messaging-sw.ts

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "Bm1FGVUv38Bd7h8p7pj65bc_yrrezQ5aU",
  authDomain: "pocketshop-f7bde.firebaseapp.com",
  projectId: "pocketshop-f7bde",
  storageBucket: "pocketshop-f7bde.firebasestorage.app",
  messagingSenderId: "619841698415",
  appId: "1:619841698415:web:7cfdeab0b8d55cfc246b9a"
});

// Initialize messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/logo_green.png',
    data: {
      url: payload.data?.url || 'https://pocketshop.co.ke'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const clickAction = event.notification?.data?.url || event.notification?.click_action || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === clickAction && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction);
      }
    })
  );
});
