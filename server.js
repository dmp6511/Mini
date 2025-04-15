const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ MongoDB Connection
// mongoose.connect('mongodb://127.0.0.1:27017/leaderboard', {})
//     .then(() => console.log('✅ MongoDB connected'))
//     .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
const teamRoutes = require('./src/team');
app.use('/', teamRoutes);

// ✅ RFID POST Endpoint
const { handleRFIDScan } = require('./src/rfid');
app.post('/rfid-scan', handleRFIDScan);

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
