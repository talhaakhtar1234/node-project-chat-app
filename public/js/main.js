const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
const availableRoomsList = document.getElementById('available-rooms');

// Get username and room from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Join chat room
socket.emit('joinRoom', { username, room });

// Listen for incoming messages from the server
socket.on('message', handleIncomingMessage);

// Listen for room and users updates
socket.on('roomUsers', ({ room, users }) => {
  displayRoomName(room);
  displayUsers(users);
});

// Listen for available rooms updates
socket.on('availableRooms', (availableRooms) => {
  displayAvailableRooms(availableRooms);
});

// Submit chat form event listener
chatForm.addEventListener('submit', handleChatFormSubmit);

// Function to output a message to the chat
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>
  `;
  chatMessages.appendChild(div);

  // Scroll down to show the latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle incoming messages
function handleIncomingMessage(message) {
  console.log(message);
  outputMessage(message);
}

// Function to handle chat form submission
function handleChatFormSubmit(e) {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit the chat message to the server
  socket.emit('chatMessage', msg);

  // Clear the input field and focus on it
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
}

// Function to display room name
function displayRoomName(room) {
  roomName.innerText = room;
}

// Function to display list of users
function displayUsers(users) {
  usersList.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = user.username;
    usersList.appendChild(li);
  });
}

// Function to display available rooms
function displayAvailableRooms(availableRooms) {
  availableRoomsList.innerHTML = '';
  availableRooms.forEach(room => {
    const li = document.createElement('li');
    li.innerText = room;
    li.addEventListener('click', () => {
      // Join the selected room
      socket.emit('joinRoom', { username, room });
    });
    availableRoomsList.appendChild(li);
  });
}
