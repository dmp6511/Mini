const express = require('express');
const router = express.Router();
const Team = require('./models/Team');
const Player = require('./models/Player');
const { generateUserId, generateTeamName } = require('../src/random');

// get all teams
router.get('/leaderboard/all', async (req, res) => {
    const allTeams = await Team.find().sort({ score: -1 });
    res.json(allTeams);
});



// Create a team with random user IDs
router.post('/create-team', async (req, res) => {
    try {
        const { playerNames } = req.body;

        if (!playerNames || !Array.isArray(playerNames)) {
            return res.status(400).json({ error: "Missing or invalid playerNames array." });
        }

        if (playerNames.length > 4) {
            return res.status(400).json({ error: "Max 4 players allowed." });
        }

        const players = await Promise.all(
            playerNames.map(async () => {
                const player = new Player({ userId: generateUserId() });
                return await player.save();
            })
        );

        const team = new Team({ name: generateTeamName(), players });
        await team.save();

        const populatedTeam = await Team.findById(team._id).populate('players');

        res.status(201).json({
            _id: populatedTeam._id,
            name: populatedTeam.name,
            players: populatedTeam.players.map(p => `User ${p.userId}`)
        });
    } catch (err) {
        console.error("Error in /create-team:", err);
        res.status(500).json({ error: "Server error while creating team." });
    }
});

// Submit a team's score
router.post('/submit-score/:teamId', async (req, res) => {
    try {
        const { score } = req.body;
        const team = await Team.findById(req.params.teamId);
        if (!team) return res.status(404).json({ error: "Team not found." });

        team.score = score;
        await team.save();
        res.json(team);
    } catch (err) {
        console.error("Error in /submit-score:", err);
        res.status(500).json({ error: "Failed to update score." });
    }
});

// Get leaderboard and current team's rank
router.get('/leaderboard/:teamId', async (req, res) => {
    try {
        const topTeams = await Team.find().sort({ score: -1 }).limit(4);
        const allTeams = await Team.find().sort({ score: -1 });

        const yourRank = allTeams.findIndex(t => t.id === req.params.teamId) + 1;
        const yourTeam = await Team.findById(req.params.teamId);

        res.json({ topTeams, yourRank, yourTeam });
    } catch (err) {
        console.error("Error in /leaderboard:", err);
        res.status(500).json({ error: "Failed to fetch leaderboard." });
    }
});

module.exports = router;
