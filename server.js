const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { startPolling } = require('./src/rfid');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/leaderboard')
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));


// Routes
const teamRoutes = require('./src/team');
app.use('/', teamRoutes);

// WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.broadcast = function (data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};


server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
