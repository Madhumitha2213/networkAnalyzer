import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';

const PacketCapture = () => {
  const [packets, setPackets] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('');
  const [filteredPackets, setFilteredPackets] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('networkPacket', (packet) => {
      const parsedPacket = parsePacket(packet);
      if (parsedPacket) {
        setPackets((prevPackets) => [parsedPacket, ...prevPackets]);
        setFilteredPackets((prevPackets) => [parsedPacket, ...prevPackets]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleStartCapture = async () => {
    try {
      const interfaceName = 'wlp2s0'; // Replace with actual interface or input value
      await axios.get(`${ENDPOINT}/api/network/start-packet-capture?interface=${interfaceName}`);
      setIsCapturing(true);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error starting packet capture');
      console.error('Error starting packet capture:', error);
    }
  };

  const handleStopCapture = async () => {
    try {
      await axios.get(`${ENDPOINT}/api/network/stop-packet-capture`);
      setIsCapturing(false);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error stopping packet capture');
      console.error('Error stopping packet capture:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilter = () => {
    const filtered = packets.filter(packet => {
      return (
        packet.srcIP.includes(filter) || 
        packet.destIP.includes(filter) ||
        (packet.protocol && packet.protocol.toString().includes(filter)) ||
        packet.info.includes(filter)
      );
    });
    setFilteredPackets(filtered.reverse());
  };

  const parsePacket = (packet) => {
    try {
      if (!packet || !packet.payload || !packet.payload.payload) {
        console.error('Invalid packet structure:', packet);
        return null;
      }
  
      const ipPacket = packet.payload.payload;
      if (!ipPacket.saddr || !ipPacket.daddr || !ipPacket.saddr.addr || !ipPacket.daddr.addr) {
        console.error('Invalid IP addresses in packet:', ipPacket);
        return null;
      }
  
      const protocol = ipPacket.protocol;
      const info = JSON.stringify(ipPacket.payload);
      const time = new Date().toLocaleTimeString();
  
      return {
        time,
        srcIP: ipPacket.saddr.addr.join('.'),
        destIP: ipPacket.daddr.addr.join('.'),
        protocol,
        length: ipPacket.length,
        info,
      };
    } catch (error) {
      console.error('Error parsing packet:', error);
      return null;
    }
  };

  return (
    <div className="section">
      <h3>Packet Capture</h3>
      <button onClick={handleStartCapture} className="button" disabled={isCapturing}>
        Start Capture
      </button>
      <button onClick={handleStopCapture} className="button" disabled={!isCapturing}>
        Stop Capture
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <h4>Captured Packets:</h4>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Enter filter criteria"
          className="input-field"
        />
        <button onClick={handleFilter} className="button">Filter</button>
        <div className="packet-container">
          <table className="packet-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Time</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Protocol</th>
                <th>Length</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackets.map((packet, index) => (
                <tr key={index}>
                  <td>{filteredPackets.length - index}</td>
                  <td>{packet.time}</td>
                  <td>{packet.srcIP}</td>
                  <td>{packet.destIP}</td>
                  <td>{packet.protocol}</td>
                  <td>{packet.length}</td>
                  <td>{packet.info}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PacketCapture;
