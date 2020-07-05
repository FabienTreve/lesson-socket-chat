const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Name of the bot
const botName = 'Chatbot';

// Run when client connects
io.on('connection', socket => {
    // Welcome current user (only notify the user)
    socket.emit('message', formatMessage(botName, 'Welcome to the chat !'));

    //Broadcast when a user connects (everyone except the actual user)
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    // Runs when client disconnects (has to be inside the 'connection')
    socket.on('disconnect', () => {
        // To everyone
        io.emit('message', formatMessage(botName, 'A user has let the chat'));
    });

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));