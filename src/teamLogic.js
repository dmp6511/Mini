const Team = require('./models/Team');
const Player = require('./models/Player');
const teamNames = require('../teamNames.json');

let currentTeam = {
    name: '',
    players: [],
    timeout: null
};

function getRandomTeamName() {
    const firstName = teamNames.teamNames.firstName;
    const secondName = teamNames.teamNames.secondName;
    // grab a random name from each array
    const randomFirstName = firstName[Math.floor(Math.random() * firstName.length)];
    const randomSecondName = secondName[Math.floor(Math.random() * secondName.length)];

    // combine and return
    return `${randomFirstName} ${randomSecondName}`;
}

function startTeamTimeout() {
    currentTeam.timeout = setTimeout(() => {
        if (currentTeam.players.length > 0) {
            submitCurrentTeam();
        }
    }, 100000); // 100 seconds
}

async function addPlayerToCurrentTeam(braceletId) {
    if (currentTeam.players.length === 0) {
        currentTeam.name = getRandomTeamName();
        startTeamTimeout();
    }

    if (currentTeam.players.find(p => p.braceletId === braceletId)) return;
    const newPlayer = new Player({ userId: braceletId });
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

module.exports = { addPlayerToCurrentTeam, getRandomTeamName };
