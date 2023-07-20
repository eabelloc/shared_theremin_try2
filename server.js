// server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected.');

  // Listen for waveform data from the clients and broadcast it to all connected clients
  socket.on('waveformData', (data) => {
    io.emit('waveformData', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
