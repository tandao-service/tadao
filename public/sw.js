self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/logo_green.png',
        image: data.image || undefined, // Add the image property if provided
        data: { url: data.data?.url } // Ensure the URL is passed
    });
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.matchAll({ type: "window" }).then((clientList) => {
                for (let client of clientList) {
                    if (client.url === event.notification.data.url && "focus" in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url);
                }
            })
        );
    }
});
