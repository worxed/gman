// src/api/games.js
import express from 'express';
import { getGames } from '../plugins/steam';

const router = express.Router();

router.get('/', async (req, res) => {
  const games = await getGames();
  res.json(games);
});

export { getGames }; // Add this line to export the getGames function
export default router