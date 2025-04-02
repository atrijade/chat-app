const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        console.log("New user joined", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', (reason) => {
        if (users[socket.id]) { // Check if the user exists
            socket.broadcast.emit('dis', { message: 'left the chat', name: users[socket.id] });
            delete users[socket.id];
        }
    });
});

server.listen(8080, () => {
    console.log('Server listening on port 8080');
});