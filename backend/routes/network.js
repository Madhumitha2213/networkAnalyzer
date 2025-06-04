const express = require('express');
const router = express.Router();
const { startPacketCapture, stopPacketCapture, pingHost, tracerouteHost, testNetworkSpeed } = require('../utils/networkAnalyzer');
const NetworkData = require('../models/NetworkData');
router.get('/start-packet-capture', (req, res) => {
  const io = req.app.get('socketio'); // Retrieve io object from the app context
  startPacketCapture(io);
  res.json({ message: 'Packet capture started' });
});

router.get('/stop-packet-capture', (req, res) => {
  stopPacketCapture();
  res.json({ message: 'Packet capture stopped' });
});

router.get('/captured-packets', async (req, res) => {
  try {
    const packets = await NetworkData.find();
    res.json(packets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
router.get('/ping', async (req, res) => {
  try {
    const result = await pingHost(req.query.host);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/traceroute', async (req, res) => {
  try {
    const result = await tracerouteHost(req.query.host);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/speedtest', async (req, res) => {
  try {
    const result = await testNetworkSpeed();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
