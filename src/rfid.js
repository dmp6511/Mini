const { addPlayerToCurrentTeam } = require('./teamLogic');

let lastScan = null;

async function pollRFIDScanner() {
    const scanned = await getLatestScan();
    if (!scanned || scanned === lastScan) return;

    lastScan = scanned;
    console.log(`📶 New scan: ${scanned}`);
    await addPlayerToCurrentTeam(scanned);
}

module.exports = {
    pollRFIDScanner,
}