import React, { useState, useEffect } from 'react';
import './App.css';
import GameList from './GameList';
import ScanSteamGames from './ScanSteamGames';
import BurgerMenu from './BurgerMenu'; // Import the BurgerMenu component

function App() {
  const [theme, setTheme] = useState('dark-theme');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkScheme ? 'dark-theme' : 'light-theme');
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark-theme' ? 'light-theme' : 'dark-theme'));
  };

  const handleScanGames = async () => {
    // Implement the logic to scan games
    setMessage('Scanning games...');
  };

  const handleUpdateGames = async () => {
    // Implement the logic to update games
    setMessage('Updating games...');
  };

  const handleClearDatabase = async () => {
    // Implement the logic to clear the database
    setMessage('Clearing database...');
  };

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <h1>Game Manager</h1>
        <BurgerMenu
          onOpenOptions={() => setIsModalOpen(true)}
          onScanGames={handleScanGames}
          onUpdateGames={handleUpdateGames}
          onClearDatabase={handleClearDatabase}
          toggleTheme={toggleTheme}
          theme={theme}
        />
        <ScanSteamGames />
        <GameList />
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;