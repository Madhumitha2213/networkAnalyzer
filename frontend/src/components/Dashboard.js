import React from 'react';
import Ping from './Ping';
import Traceroute from './Traceroute';
import SpeedTest from './SpeedTest';
import PacketCapture from './PacketCapture';

const Dashboard = () => {
  return (
    <div className="container">
      <h2>Network Analyzer Dashboard</h2>
      <section id="packet-capture">
        <PacketCapture />
      </section>
      <section id="ping">
        <Ping />
      </section>
      <section id="traceroute">
        <Traceroute />
      </section>
      <section id="speed-test">
        <SpeedTest />
      </section>
    </div>
  );
};

export default Dashboard;
