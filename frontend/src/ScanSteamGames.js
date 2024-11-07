import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OptionsModal from './OptionsModal'; // Import the OptionsModal component
import BurgerMenu from './BurgerMenu'; // Import the BurgerMenu component

const ScanSteamGames = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [steamApiKey, setSteamApiKey] = useState(''); // Define state for Steam API key
  const [steamUserId, setSteamUserId] = useState(''); // Define state for Steam user ID
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Define state for menu open

  useEffect(() => {
    // Fetch the saved configuration when the component mounts
    const fetchConfig = async () => {
      try {
        const response = await axios.get('/get-config');
        if (response.data) {
          setSteamApiKey(response.data.steamApiKey);
          setSteamUserId(response.data.steamUserId);
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      }
    };

    fetchConfig();
  }, []);

  const handleSaveConfig = async (steamApiKey, steamUserId) => {
    try {
      const response = await axios.post('/save-config', { steamApiKey, steamUserId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to save configuration');
      console.error(error);
    }
  };

  const handleScanGames = async () => {
    try {
      const response = await axios.post('/scan-steam-games', { steamApiKey, steamUserId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to scan Steam games');
      console.error(error);
    }
  };

  const handleUpdateGames = async () => {
    try {
      const response = await axios.post('/update-steam-games', { steamApiKey, steamUserId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to update Steam games');
      console.error(error);
    }
  };

  const handleClearDatabase = async () => {
    try {
      const response = await axios.post('/clear-database');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Failed to clear database');
      console.error(error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`main-content ${isMenuOpen ? 'shifted' : ''}`}>
      <BurgerMenu
        onOpenOptions={() => setIsModalOpen(true)}
        onScanGames={handleScanGames}
        onUpdateGames={handleUpdateGames}
        onClearDatabase={handleClearDatabase}
        toggleMenu={toggleMenu}
      />
      <OptionsModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSaveConfig={handleSaveConfig}
        steamApiKey={steamApiKey}
        steamUserId={steamUserId}
      />
      {message && <p>{message}</p>}
    </div>
  );
};

export default ScanSteamGames;