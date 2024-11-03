import React, { useState, useEffect } from 'react';
import './App.css';
import { getGames } from './api/games';

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const fetchedGames = await getGames();
      setGames(fetchedGames);
    };
    fetchGames();
  }, []);

  return (
    <div className="App">
      <nav className="nav">
        <ul>
          <li><a href="#">Games</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>
      <main className="main">
        <h1>Game Manager</h1>
        <p>This is the main content area.</p>
        <ul>
          {games.map((game) => (
            <li key={game.appId}>
              <img src={game.iconUrl} alt={game.title} />
              <h3>{game.title}</h3>
              <p>{game.platforms.join(', ')}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;