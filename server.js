const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const {
  userJoin,
  getCurrUser,
  userLeave
} = require('./utils/utils');
const formatMessages = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatCord Bot';

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', handleConnection);

function handleConnection(socket) {
  socket.on('joinRoom', handleJoinRoom.bind(null, socket));
  socket.on('chatMessage', handleChatMessage.bind(null, socket));
  socket.on('disconnect', handleDisconnect.bind(null, socket));
}

function handleJoinRoom(socket, { username, room }) {
  const user = userJoin(socket.id, username, room);
  socket.join(user.room);

  // Send a welcome message to the connected client
  socket.emit('message', formatMessages(botName, 'Welcome to ChatCord'));

  // Broadcast to all clients in the room that a new user has joined the chat
  socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has joined the chat`));
}

function handleChatMessage(socket, msg) {
  const user = getCurrUser(socket.id);
  io.to(user.room).emit('message', formatMessages(user.username, msg));
}

function handleDisconnect(socket) {
  const user = userLeave(socket.id);
  if (user) {
    io.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`));
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
