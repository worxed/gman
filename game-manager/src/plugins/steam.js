const SteamAPI = require('steam-api');
const steamApi = new SteamAPI({
  apiKey: 'YOUR_STEAM_API_KEY',
});

const getSteamGames = async () => {
  const games = await steamApi.getGames({
    include: ['name', 'appid', 'img_icon_url', 'img_logo_url'],
  });

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