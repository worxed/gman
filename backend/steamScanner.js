const axios = require('axios');
const fs = require('fs');
const path = require('path');
const vdf = require('vdf'); // Install this package to parse VDF files
const Game = require('./models/game.model'); // Import the Game model

const getSteamLibraryPaths = () => {
  const steamConfigPath = 'C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf';
  const libraryPaths = [];

  if (fs.existsSync(steamConfigPath)) {
    const vdfContent = fs.readFileSync(steamConfigPath, 'utf-8');
    const parsedVdf = vdf.parse(vdfContent);

    for (const key in parsedVdf.LibraryFolders) {
      if (!isNaN(key)) {
        libraryPaths.push(path.join(parsedVdf.LibraryFolders[key], 'steamapps'));
      }
    }
  }

  return libraryPaths;
};

const getInstalledSteamGames = () => {
  const steamLibraryPaths = getSteamLibraryPaths();
  const installedGames = [];

  steamLibraryPaths.forEach(libraryPath => {
    if (fs.existsSync(libraryPath)) {
      const files = fs.readdirSync(libraryPath);
      files.forEach(file => {
        if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
          const filePath = path.join(libraryPath, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const parsedContent = vdf.parse(content);
          const appid = parsedContent.AppState.appid;
          const name = parsedContent.AppState.name;
          const gamePath = path.join(libraryPath, 'common', name);
          installedGames.push({ appid, name, path: gamePath });
        }
      });
    }
  });

  console.log('Installed games:', installedGames); // Add logging here
  return installedGames;
};

const getOwnedSteamGames = async (steamApiKey, steamUserId) => {
  try {
    const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`, {
      params: {
        key: steamApiKey,
        steamid: steamUserId,
        format: 'json',
        include_appinfo: true, // Include app info to get game names
        include_played_free_games: true // Include free games
      }
    });
    console.log('Owned games response:', response.data.response.games); // Add logging here
    return response.data.response.games;
  } catch (error) {
    console.error('Error fetching owned games:', error);
    return [];
  }
};

const getSteamGameDetails = async (appId) => {
  try {
    const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    console.log(`Details for appId ${appId}:`, response.data[appId].data); // Add logging here
    return response.data[appId].data;
  } catch (error) {
    console.error(`Error fetching details for appId ${appId}:`, error);
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scanSteamGames = async (steamApiKey, steamUserId) => {
  const installedGames = getInstalledSteamGames();
  const ownedGames = await getOwnedSteamGames(steamApiKey, steamUserId);

  console.log('Owned games:', ownedGames); // Add logging here

  for (const ownedGame of ownedGames) {
    const installedGame = installedGames.find(g => g.appid === ownedGame.appid);
    const details = await getSteamGameDetails(ownedGame.appid);
    if (details) {
      const gameData = {
        name: details.name,
        path: installedGame ? installedGame.path : 'Not Installed', // Provide default value for path
        metadata: {
          description: details.short_description,
          developers: Array.isArray(details.developers) ? details.developers.join(', ') : details.developers,
          publishers: Array.isArray(details.publishers) ? details.publishers.join(', ') : details.publishers,
          release_date: details.release_date.date,
        }
      };

      // Insert the game data into MongoDB
      try {
        await Game.create(gameData);
        console.log(`Game added to DB: ${details.name}`);
      } catch (error) {
        console.error(`Error adding game to DB: ${details.name}`, error);
      }
    }
    await delay(1000); // Add delay between requests to avoid rate limiting
  }

  console.log('Finished scanning Steam games');
};

module.exports = { scanSteamGames };