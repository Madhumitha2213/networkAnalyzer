import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Network Analyzer</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
