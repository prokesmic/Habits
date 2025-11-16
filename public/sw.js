self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: { url: data.url, notificationId: data.id },
    actions: [
      { action: 'open', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: data.tag,
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(data.title || 'Habit Tracker', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow((event.notification.data && event.notification.data.url) || '/'));
    fetch('/api/notifications/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId: event.notification.data && event.notification.data.notificationId,
      }),
    }).catch(() => {});
  }
});


