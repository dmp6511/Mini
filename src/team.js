const Team = require('./models/Team');
const Player = require('./models/Player');
const teamNames = require('./teamNames.json');

let currentTeam = {
    name: '',
    players: [],
    timeout: null
};

// Function to get a random team name
// pull a first name and a last name from the teamNames.json file
function getRandomTeamName() {
    const firstNames = teamNames.firstNames;
    const lastNames = teamNames.lastNames;

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${randomFirstName} ${randomLastName}`;
};

function startTeamTimeout() {
    currentTeam.timeout = setTimeout(() => {
        if (currentTeam.players.length > 0) {
            submitCurrentTeam();
        }
    }, 10000); // 10 seconds
}

async function addPlayerToCurrentTeam(braceletId) {
    if (currentTeam.players.length === 0) {
        currentTeam.name = getRandomTeamName();
        startTeamTimeout();
    }

    // Prevent duplicates
    if (currentTeam.players.find(p => p.braceletId === braceletId)) return;

    const newPlayer = new Player({ braceletId });
    const savedPlayer = await newPlayer.save();

    currentTeam.players.push(savedPlayer);

    if (currentTeam.players.length === 4) {
        await submitCurrentTeam();
    }
}

async function submitCurrentTeam() {
    clearTimeout(currentTeam.timeout);

    const team = new Team({
        name: currentTeam.name,
        players: currentTeam.players.map(p => p._id),
        score: 0
    });

    await team.save();

    console.log(`✅ Team ${team.name} saved with ${currentTeam.players.length} players.`);

    currentTeam = { name: '', players: [], timeout: null };
}

module.exports = {
    addPlayerToCurrentTeam,
    // (plus any existing exports you already have like leaderboard routes)
};
