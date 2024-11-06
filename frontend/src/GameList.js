import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GameList.css'; // Ensure the CSS file is imported

const GameList = () => {
  const [games, setGames] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // Add state for sort order

  useEffect(() => {
    axios.get('/games/')
      .then(response => {
        setGames(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedGames = [...games].sort((a, b) => {
    let comparison = 0;
    if (sortCriteria === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortCriteria === 'release_date') {
      comparison = new Date(a.metadata.release_date) - new Date(b.metadata.release_date);
    } else if (sortCriteria === 'price') {
      const priceA = parseFloat(a.metadata.price.replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.metadata.price.replace(/[^0-9.-]+/g, "")) || 0;
      comparison = priceA - priceB;
    } else if (sortCriteria === 'metacritic_score') {
      comparison = b.metadata.metacritic_score - a.metadata.metacritic_score;
    } else if (sortCriteria === 'steam_score') {
      comparison = b.metadata.steam_score - a.metadata.steam_score;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getSortLabel = (game) => {
    if (sortCriteria === 'price') {
      return game.metadata.price;
    } else if (sortCriteria === 'metacritic_score') {
      return `Metacritic: ${game.metadata.metacritic_score}`;
    } else if (sortCriteria === 'steam_score') {
      return `Steam: ${game.metadata.steam_score}`;
    } else if (sortCriteria === 'release_date') {
      return game.metadata.release_date;
    }
    return '';
  };

  return (
    <div className="game-list">
      <h2>Game List</h2>
      <div className="sort-by">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={sortCriteria} onChange={handleSortChange}>
          <option value="name">Name</option>
          <option value="release_date">Release Date</option>
          <option value="price">Price</option>
          <option value="metacritic_score">Metacritic Score</option>
          <option value="steam_score">Steam Score</option>
        </select>
        <button onClick={handleSortOrderToggle}>
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>
      <div className="game-icons">
        {sortedGames.map(game => (
          <div key={game._id} className="game-icon">
            <img src={game.metadata.icon_url} alt={game.name} />
            <p>{game.name}</p>
            <div className="tooltip">
              <p><strong>Description:</strong> {game.metadata.description}</p>
              <p><strong>Developers:</strong> {game.metadata.developers}</p>
              <p><strong>Publishers:</strong> {game.metadata.publishers}</p>
              <p><strong>Release Date:</strong> {game.metadata.release_date}</p>
              <p><strong>Genres:</strong> {game.metadata.genres}</p>
              <p><strong>Platforms:</strong> {game.metadata.platforms}</p>
              <p><strong>Price:</strong> {game.metadata.price}</p>
              <p><strong>Metacritic Score:</strong> {game.metadata.metacritic_score}</p>
              <p><strong>Steam Score:</strong> {game.metadata.steam_score}</p>
            </div>
            <div className="sort-label">{getSortLabel(game)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;