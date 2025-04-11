// models/Player.js
const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
    userId: Number,
});

module.exports = mongoose.model('Player', PlayerSchema);


