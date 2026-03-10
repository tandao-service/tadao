export const subscribeToNotifications = async (userId: string) => {

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications are not supported');
        return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    const response = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + 'subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscription })
    });

    if (response.ok) {
        console.log('User subscribed to notifications');
    } else {
        console.error('Subscription failed');
    }
};
