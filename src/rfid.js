const { addPlayerToCurrentTeam } = require('./team');

const handleRFIDScan = async (req, res) => {
    const { braceletId } = req.body;

    if (!braceletId) {
        return res.status(400).send('Missing braceletId');
    }

    try {
        await addPlayerToCurrentTeam(braceletId);
        res.status(200).send('Player added to team');
    } catch (err) {
        console.error('RFID scan error:', err);
        res.status(500).send('Server error');
    }
};

module.exports = { handleRFIDScan };
