const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const { userJoin, getCurrUser, userLeave, getRoomUsers, getAvailableRooms } = require('./utils/utils');
const formatMessages = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'Chat Bot';

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', (socket) => {
  // Listen for joinRoom event
  socket.on('joinRoom', ({ username, room }) => {
    // Leave the current room if any
    const prevUser = getCurrUser(socket.id);
    if (prevUser) {
      socket.leave(prevUser.room);
    }

    // Join the new room
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Send a welcome message to the connected client
    socket.emit('message', formatMessages(botName, 'Welcome to ChatCord'));

    // Broadcast to all clients in the room that a new user has joined the chat
    socket.broadcast.to(user.room).emit('message', formatMessages(botName, `${user.username} has joined the chat`));

    // Emit 'roomUsers' event when a user joins
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });

    // Update available rooms for all clients
    io.emit('availableRooms', getAvailableRooms());
  });

  // Listen for chat messages
  socket.on('chatMessage', (msg) => {
    const user = getCurrUser(socket.id);
    io.to(user.room).emit('message', formatMessages(user.username, msg));
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessages(botName, `${user.username} has left the chat`));

      // Emit 'roomUsers' event when a user leaves
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      // Update available rooms for all clients
      io.emit('availableRooms', getAvailableRooms());
    }
  });

  // Emit available rooms to the connecting client
  socket.emit('availableRooms', getAvailableRooms());
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
