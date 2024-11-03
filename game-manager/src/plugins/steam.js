// steam.js
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const getSteamId = async () => {
  const steamConfigDir = process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Steam\\config'
    : process.platform === 'darwin'
      ? '~/Library/Application Support/Steam/config'
      : '~/.steam/config';

  const steamCfgFile = path.join(steamConfigDir, 'steam.cfg');
  const steamCfgContent = await fs.promises.readFile(steamCfgFile, 'utf8');
  const steamIdMatch = steamCfgContent.match(/"SteamID"\s*"(\d+)"/);

  if (steamIdMatch) {
    return steamIdMatch[1];
  } else {
    throw new Error('Failed to extract Steam ID from steam.cfg file');
  }
};

const getSteamGames = async () => {
  const steamId = await getSteamId();
  const apiKey = 'your_api_key';
  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;

  const response = await axios.get(url);
  const games = response.data.response.games;

  return games.map((game) => ({
    title: game.name,
    appId: game.appid,
    iconUrl: game.img_icon_url,
    logoUrl: game.img_logo_url,
    platforms: ['Steam'],
  }));
};

module.exports = {
  name: 'Steam',
  getGames: getSteamGames,
};