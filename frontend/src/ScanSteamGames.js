import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OptionsModal from './OptionsModal'; // Import the OptionsModal component
import BurgerMenu from './BurgerMenu'; // Import the BurgerMenu component
import MessageOverlay from './MessageOverlay'; // Import the MessageOverlay component

const ScanSteamGames = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [steamApiKey, setSteamApiKey] = useState(''); // Define state for Steam API key
  const [steamUserId, setSteamUserId] = useState(''); // Define state for Steam user ID
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Define state for menu open
  const [gameCount, setGameCount] = useState(0); // Define state for game count

  useEffect(() => {
    // Fetch the saved configuration and game count when the component mounts
    const fetchConfigAndGameCount = async () => {
      try {
        const configResponse = await axios.get('/get-config');
        if (configResponse.data) {
          setSteamApiKey(configResponse.data.steamApiKey);
          setSteamUserId(configResponse.data.steamUserId);
        }

        const gameCountResponse = await axios.get('/games/count');
        if (gameCountResponse.data) {
          setGameCount(gameCountResponse.data.count);
        }
      } catch (error) {
        console.error('Error fetching configuration or game count:', error);
      }
    };

    fetchConfigAndGameCount();

    // Set an interval to fetch the game count every 10 seconds
    const intervalId = setInterval(async () => {
      try {
        const gameCountResponse = await axios.get('/games/count');
        if (gameCountResponse.data) {
          setGameCount(gameCountResponse.data.count);
        }
      } catch (error) {
        console.error('Error fetching game count:', error);
      }
    }, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
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
      // Update game count after scanning
      const gameCountResponse = await axios.get('/games/count');
      if (gameCountResponse.data) {
        setGameCount(gameCountResponse.data.count);
      }
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
      // Update game count after clearing the database
      const gameCountResponse = await axios.get('/games/count');
      if (gameCountResponse.data) {
        setGameCount(gameCountResponse.data.count);
      }
    } catch (error) {
      setMessage('Failed to clear database');
      console.error(error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMessageOverlay = () => {
    setMessage('');
  };

  return (
    <div className={`main-content ${isMenuOpen ? 'shifted' : ''}`}>
      <BurgerMenu
        onOpenOptions={() => setIsModalOpen(true)}
        onScanGames={gameCount === 0 ? handleScanGames : null}
        onUpdateGames={gameCount > 0 ? handleUpdateGames : null}
        onClearDatabase={handleClearDatabase}
        toggleMenu={toggleMenu}
        gameCount={gameCount} // Pass gameCount to BurgerMenu
      />
      <OptionsModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSaveConfig={handleSaveConfig}
        steamApiKey={steamApiKey}
        steamUserId={steamUserId}
      />
      <MessageOverlay message={message} onClose={closeMessageOverlay} />
    </div>
  );
};

export default ScanSteamGames;