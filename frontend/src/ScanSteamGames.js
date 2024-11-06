import React, { useState } from 'react';
import axios from 'axios';

const ScanSteamGames = () => {
  const [steamApiKey, setSteamApiKey] = useState('');
  const [steamUserId, setSteamUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/scan-steam-games', { steamApiKey, steamUserId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to scan Steam games');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Scan Steam Games</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Steam API Key:</label>
          <input
            type="text"
            value={steamApiKey}
            onChange={(e) => setSteamApiKey(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Steam User ID (numeric):</label>
          <input
            type="text"
            value={steamUserId}
            onChange={(e) => setSteamUserId(e.target.value)}
            required
          />
        </div>
        <button type="submit">Scan</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ScanSteamGames;