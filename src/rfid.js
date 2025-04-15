const { getLatestScan } = require('./rfidScraper');
const { addPlayerToCurrentTeam } = require('./teamLogic');

let lastScan = null;

async function pollRFIDScanner() {
    const scanned = await getLatestScan();
    if (!scanned || scanned === lastScan) return;

    lastScan = scanned;
    console.log(`📶 New scan: ${scanned}`);
    await addPlayerToCurrentTeam(scanned);
}

function startPolling(onNewScan) {
    setInterval(async () => {
        const scanned = await getLatestScan();
        if (!scanned || scanned === lastScan) return;

        lastScan = scanned;
        console.log(`📶 New scan: ${scanned}`);
        await addPlayerToCurrentTeam(scanned);
        onNewScan(scanned);
    }, 5000); // every 5 seconds
}

module.exports = { startPolling };
