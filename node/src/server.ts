import { createApp } from './app.js';
createApp().listen(4500, '127.0.0.1', () => {
  console.log('Local Tasks API: http://127.0.0.1:4500');
});
