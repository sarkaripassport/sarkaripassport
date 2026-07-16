import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, isSupported, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCfJ4XmDCxpjeoX6rNZX9IFPfnJNZN8yc8",
  authDomain: "gjw-notification.firebaseapp.com",
  projectId: "gjw-notification",
  storageBucket: "gjw-notification.firebasestorage.app",
  messagingSenderId: "972683653086",
  appId: "1:972683653086:web:13e82e4f6ca9ef6fa9b74f",
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const initMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      return getMessaging(app);
    }
  } catch (error) {
    console.error("Firebase Messaging not supported", error);
  }
  return null;
};

export const requestFirebaseNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const messaging = await initMessaging();
      if (!messaging) return null;
      
      const currentToken = await getToken(messaging, {
        vapidKey: "BPasocWKJAb4mUm2ELqKQRVs_AfzzRaHmHFLN3Tr7D_XAowJ5ySbxuu3nTcqQl5HNWnLZIULozHJBYCo6ss6lt8"
      });
      
      if (currentToken) {
        console.log('FCM Token received:', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
    return null;
  }
};

export const onMessageListener = async () => {
  const messaging = await initMessaging();
  if (!messaging) return () => {};
  
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};
