// models/Player.js
const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
    userId: Number,
    score: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Player', PlayerSchema);


