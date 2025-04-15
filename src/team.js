const express = require('express');
const router = express.Router();
const Team = require('./models/Team');
const Player = require('./models/Player');
const { getRandomTeamName } = require('./teamLogic');

// ✅ Create a new team from player names
router.post('/create-team', async (req, res) => {
    let { playerNames, teamName } = req.body;

    if (!playerNames || !Array.isArray(playerNames) || playerNames.length === 0) {
        return res.status(400).json({ error: 'No player names provided' });
    }

    try {
        const savedPlayers = await Promise.all(
            playerNames.map(name => new Player({ braceletId: name }).save())
        );

        // generate a team name
        teamName = getRandomTeamName();

        // create a new team with the saved players
        const team = new Team({
            name: teamName || 'Unnamed Team',
            players: savedPlayers.map(p => p._id),
            score: 0
        });

        await team.save();

        res.status(201).json({ message: 'Team created', team });
    } catch (err) {
        console.error('❌ Error creating team:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Submit a final score for a team
router.post('/submit-score/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const { score } = req.body;

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: 'Team not found' });

        team.score = score;
        await team.save();

        res.status(200).json({ message: 'Score updated', team });
    } catch (err) {
        console.error('❌ Error updating score:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get full leaderboard
router.get('/leaderboard/all', async (req, res) => {
    try {
        const teams = await Team.find().sort({ score: -1 }).populate('players');
        res.json(teams);
    } catch (err) {
        console.error('❌ Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Could not fetch leaderboard' });
    }
});

// ✅ Get individual team details
router.get('/leaderboard/:teamId', async (req, res) => {
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId).populate('players');
        if (!team) return res.status(404).json({ error: 'Team not found' });

        res.json(team);
    } catch (err) {
        console.error('❌ Error fetching team:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;