const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const formatMessages=require('./utils/message')

const path = require('path');

const botName='ChatCord Bot'

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));




// Run when client connects
io.on('connection', (socket) => {
    // Send a welcome message to the connected client
    socket.emit('message', formatMessages(botName,'Welcome to ChatCord'));

    // Broadcast to all clients that a new user has joined the chat
    socket.broadcast.emit('message', formatMessages(botName,'A user has joined the chat'));

    socket.on('disconnect', () => {
        io.emit('message', formatMessages(botName,'A user has left the Chat'))
    })
    //listen for chat messsage
    socket.on('chatMessage',msg =>{
        io.emit('message',formatMessages('USER',msg))
    })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
