import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BurgerMenu.css'; // Ensure the CSS file is imported

const BurgerMenu = ({ onOpenOptions, onScanGames, onUpdateGames, onClearDatabase, toggleTheme, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    // Fetch the game count when the component mounts
    const fetchGameCount = async () => {
      try {
        const response = await axios.get('/games/count');
        if (response.data) {
          setGameCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching game count:', error);
      }
    };

    fetchGameCount();

    // Set an interval to fetch the game count every 10 seconds
    const intervalId = setInterval(fetchGameCount, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScanGames = async () => {
    setIsScanning(true);
    await onScanGames();
    setIsScanning(false);
    // Fetch the game count after scanning
    const response = await axios.get('/games/count');
    if (response.data) {
      setGameCount(response.data.count);
    }
  };

  const handleUpdateGames = async () => {
    setIsUpdating(true);
    await onUpdateGames();
    setIsUpdating(false);
  };

  const handleClearDatabase = async () => {
    setIsClearing(true);
    await onClearDatabase();
    setIsClearing(false);
    // Fetch the game count after clearing the database
    const response = await axios.get('/games/count');
    if (response.data) {
      setGameCount(response.data.count);
    }
  };

  return (
    <div>
      <div className={`burger-menu ${isOpen ? 'open' : ''}`}>
        <div className={`menu-icon ${isOpen ? 'open' : ''}`} onClick={handleToggleMenu}>
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </div>
      <div className={`menu-content ${isOpen ? 'open' : ''}`}>
        <button onClick={onOpenOptions}>Open Options</button>
        {gameCount === 0 && (
          <button onClick={handleScanGames} disabled={isScanning}>
            {isScanning ? 'Scanning Games...' : 'Scan Games'}
          </button>
        )}
        {gameCount > 0 && (
          <button onClick={handleUpdateGames} disabled={isUpdating}>
            {isUpdating ? 'Updating Games...' : 'Update Games'}
          </button>
        )}
        <button onClick={handleClearDatabase} disabled={isClearing}>
          {isClearing ? 'Clearing Database...' : 'Clear Database'}
        </button>
        <button onClick={toggleTheme}>
          Switch to {theme === 'dark-theme' ? 'Light' : 'Dark'} Theme
        </button>
      </div>
    </div>
  );
};

export default BurgerMenu;