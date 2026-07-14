importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
  // We can pass these via URL query params when registering the service worker,
  // or we can hardcode them here since they are public keys anyway.
  // We'll hardcode them based on the provided config.
  apiKey: "AIzaSyCfJ4XmDCxpjeoX6rNZX9IFPfnJNZN8yc8",
  authDomain: "gjw-notification.firebaseapp.com",
  projectId: "gjw-notification",
  storageBucket: "gjw-notification.firebasestorage.app",
  messagingSenderId: "972683653086",
  appId: "1:972683653086:web:13e82e4f6ca9ef6fa9b74f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'New Update';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo.svg', // Assumes you have a logo.svg in public
    badge: '/logo.svg',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Navigate to the URL if passed in payload data
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // If so, just focus it.
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
