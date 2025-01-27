// Check if Service Worker is supported and register it
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((error) => console.error('Service Worker Error:', error))
}
