const { pingHost, tracerouteHost, testNetworkSpeed, capturePackets } = require('../utils/networkAnalyzer');
const NetworkData = require('../models/NetworkData');

exports.ping = async (req, res) => {
  try {
    const result = await pingHost(req.query.host);
    // Save the result to MongoDB
    const networkData = new NetworkData({
      type: 'ping',
      data: result
    });
    await networkData.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.traceroute = async (req, res) => {
  try {
    const result = await tracerouteHost(req.query.host);
    // Save the result to MongoDB
    const networkData = new NetworkData({
      type: 'traceroute',
      data: result
    });
    await networkData.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.speedTest = async (req, res) => {
  try {
    const result = await testNetworkSpeed();
    // Save the result to MongoDB
    const networkData = new NetworkData({
      type: 'speedTest',
      data: result
    });
    await networkData.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.startPacketCapture = (req, res) => {
  capturePackets(req.query.interface);
  res.json({ message: 'Packet capture started' });
};
