import React from 'react';
import './App.css';
import GameList from './GameList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Game Manager</h1>
        <GameList />
      </header>
    </div>
  );
}

export default App;