// models/Team.js
const mongoose = require('mongoose');
const TeamSchema = new mongoose.Schema({
    name: String,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    score: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', TeamSchema);