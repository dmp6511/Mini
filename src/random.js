// utils/random.js
function generateUserId() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = { generateUserId };
