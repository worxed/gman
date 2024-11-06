import React from 'react';

const GameItem = ({ game }) => {
  return (
    <li>{game.name}</li>
  );
};

export default GameItem;