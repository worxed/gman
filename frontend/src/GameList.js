import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GameItem from './GameItem';

const GameList = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get('/games/')
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h2>Game List</h2>
      <ul>
        {games.map(game => (
          <GameItem key={game._id} game={game} />
        ))}
      </ul>
    </div>
  );
};

export default GameList;