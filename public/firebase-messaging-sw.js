// firebase-messaging-sw.ts

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCkciuEMV1h8MsJH6O0S6IU8hcsRsZUOVU",
  authDomain: "tadao-6679b.firebaseapp.com",
  projectId: "tadao-6679b",
  storageBucket: "tadao-6679b.firebasestorage.app",
  messagingSenderId: "1033579054775",
  appId: "1:1033579054775:web:f24135b221d3922611af32"
});

// Initialize messaging
const messaging = firebase.messaging();
messaging.onBackgroundMessage(async function (payload) {
  console.log('Received background message ', payload);

  const allClients = await clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  let isAppOpen = false;

  for (const client of allClients) {
    // Check if at least one window is focused and open on your app domain
    if (client.url.includes('tadaomarket.com') && 'focus' in client) {
      isAppOpen = true;
      break;
    }
  }

  if (!isAppOpen) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon || '/logo.png',
      data: {
        url: payload.data?.url || 'https://tadaomarket.com',
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  } else {
    console.log('App is already open — not showing notification.');
  }
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
