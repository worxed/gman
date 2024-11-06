import React from 'react';
import './App.css';
import GameList from './GameList';
import ScanSteamGames from './ScanSteamGames';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Game Manager</h1>
        <ScanSteamGames />
        <GameList />
      </header>
    </div>
  );
}

export default App;