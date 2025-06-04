const pcap = require('pcap');
const { exec } = require('child_process');
const NetworkData = require('../models/NetworkData')

let pcapSession = null;

const startPacketCapture = (io) => {
  if (pcapSession) {
    console.log('Packet capture is already running.');
    return;
  }

  const interfaceName = 'eth0'; // Replace with your network interface name
  pcapSession = pcap.createSession(interfaceName, 'ip proto \\tcp');

  pcapSession.on('packet', (rawPacket) => {
    const packet = pcap.decode.packet(rawPacket);
    io.emit('networkPacket', packet);

    const ipPacket = packet.payload.payload;
    const protocol = ipPacket.protocol;
    const info = JSON.stringify(ipPacket.payload);
    const time = new Date().toLocaleTimeString();

    const networkData = new NetworkData({
      time,
      srcIP: ipPacket.saddr.addr.join('.'),
      destIP: ipPacket.daddr.addr.join('.'),
      protocol,
      length: ipPacket.length,
      info,
    });

    networkData.save((err) => {
      if (err) {
        console.error('Error saving packet to database:', err);
      }
    });
  });

  console.log('Packet capture started.');
};

const stopPacketCapture = () => {
  if (!pcapSession) {
    console.log('No packet capture is running.');
    return;
  }

  pcapSession.close();
  pcapSession = null;
  console.log('Packet capture stopped.');
};
const pingHost = (host) => {
  return new Promise((resolve, reject) => {
    exec(`ping -c 4 ${host}`, (error, stdout, stderr) => {
      if (error) {
        reject(`ping error: ${stderr}`);
      } else {
        resolve({ target: host, output: stdout });
      }
    });
  });
};

const tracerouteHost = (host) => {
  return new Promise((resolve, reject) => {
    exec(`traceroute ${host}`, (error, stdout, stderr) => {
      if (error) {
        reject(`traceroute error: ${stderr}`);
      } else {
        resolve({ target: host, output: stdout });
      }
    });
  });
};

const testNetworkSpeed = () => {
  return new Promise((resolve, reject) => {
    exec(`speedtest-cli --json`, (error, stdout, stderr) => {
      if (error) {
        reject(`speedtest error: ${stderr}`);
      } else {
        resolve(JSON.parse(stdout));
      }
    });
  });
};

module.exports = {
  pingHost,
  tracerouteHost,
  testNetworkSpeed,
  startPacketCapture,
  stopPacketCapture,
};
