import React, { useState } from 'react';

const Ping = () => {
  const [host, setHost] = useState('');
  const [pingResult, setPingResult] = useState('');

  const handlePing = async () => {
    const response = await fetch(`http://localhost:5000/api/network/ping?host=${host}`);
    const data = await response.json();
    setPingResult(data.output);
  };

  return (
    <div className="section">
      <h2>Ping</h2>
      <input className='input-field'
        type="text"
        placeholder="Host (e.g., google.com or 8.8.8.8)"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <button className="button" onClick={handlePing}>Ping</button>
      
      <pre>{pingResult}</pre>
    </div>
  );
};

export default Ping;
