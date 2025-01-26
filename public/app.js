const socket = io();

// Form publish
const publishForm = document.getElementById('publish-form');
const topicInput = document.getElementById('topic');
const messageInput = document.getElementById('message');
const messagesList = document.getElementById('messages');

// Kirim pesan ke server saat form disubmit
publishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const topic = topicInput.value;
  const message = messageInput.value;
  socket.emit('publish', { topic, message });
  topicInput.value = '';
  messageInput.value = '';
});

// Terima pesan dari server
socket.on('mqttMessage', (data) => {
  const li = document.createElement('li');
  li.textContent = `Topic: ${data.topic} | Message: ${data.message}`;
  messagesList.appendChild(li);
});
