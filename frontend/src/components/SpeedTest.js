import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpeedTest = () => {
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeedTest = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/network/speedtest');
      setResult(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Server error');
      console.error('Error performing speed test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToMBps = (speed) => {
    return speed / 8 / 1000000; // Convert from bits per second to MB/s
  };

  const data = {
    labels: ['Download Speed', 'Upload Speed'],
    datasets: [
      {
        label: 'Speed (MB/s)',
        data: result ? [convertToMBps(result.download), convertToMBps(result.upload)] : [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + ' MB/s';
          },
        },
      },
    },
  };

  return (
    <div className="section">
      <h3>Speed Test</h3>
      <button onClick={handleSpeedTest} className="button" disabled={isLoading}>
        {isLoading ? 'Testing...' : 'Start Speed Test'}
      </button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading && <p>Performing speed test...</p>}
      {result && (
        <div>
          <h4>Speed Test Result:</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default SpeedTest;
