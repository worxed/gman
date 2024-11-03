// steam-plugin.js
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
    installationPath: getInstallationPath(game.appid),
  }));
};

const getInstallationPath = (appId) => {
  // This function can be implemented to retrieve the installation path of a Steam game
  // For example, on Windows, it can be something like:
  // `C:\\Program Files (x86)\\Steam\\steamapps\\common\\${appId}`
  // On macOS, it can be something like:
  // `/Applications/Steam.app/Contents/MacOS/steamapps/common/${appId}`
  // We can use the `steam-api` library to retrieve the installation path
  // or we can use a different approach, such as using the `fs` module to scan the file system
  // For now, let's just return a placeholder value
  return `/path/to/steam/game/${appId}`;
};

module.exports = {
  name: 'Steam',
  getGames: getSteamGames,
};