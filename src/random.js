// utils/random.js
function generateUserId() {
    return Math.floor(100000 + Math.random() * 900000);
}

function generateTeamName() {
    const adjectives = ['Mighty', 'Swift', 'Clever', 'Bold', 'Sneaky'];
    const animals = ['Lions', 'Wolves', 'Ravens', 'Dragons', 'Bears'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${animals[Math.floor(Math.random() * animals.length)]}`;
}

module.exports = { generateUserId, generateTeamName };
