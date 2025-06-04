import React, { useState } from 'react';

const Traceroute = () => {
  const [host, setHost] = useState('');
  const [tracerouteResult, setTracerouteResult] = useState('');

  const handleTraceroute = async () => {
    const response = await fetch(`http://localhost:5000/api/network/traceroute?host=${host}`);
    const data = await response.json();
    setTracerouteResult(data.output);
  };

  return (
    <div className="section">
      <h2>Traceroute</h2>
      <input className='input-field'
        type="text"
        placeholder="Host (e.g., google.com or 8.8.8.8)"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      />
      <button onClick={handleTraceroute} className='button'>Traceroute</button>
      <pre>{tracerouteResult}</pre>
    </div>
  );
};

export default Traceroute;
