importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCsAXRsxLZ-Eq0rusQTejGLRdaZKklZc3g",
  authDomain: "fir-n-steel-fabrication.firebaseapp.com",
  projectId: "fir-n-steel-fabrication",
  storageBucket: "fir-n-steel-fabrication.firebasestorage.app",
  messagingSenderId: "695357056360",
  appId: "1:695357056360:web:4f03c35ec95f7d1d31a2dd",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Message:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/logo.png', // optional
  });
});
