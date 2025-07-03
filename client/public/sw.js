self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting(); // activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  self.clients.claim(); // take control of uncontrolled clients
});
