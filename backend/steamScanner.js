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
    if (error.response && error.response.status === 403) {
      console.error(`Access denied for appId ${appId}:`, error.response.data);
    } else {
      console.error(`Error fetching details for appId ${appId}:`, error);
    }
    return null;
  }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scanSteamGames = async (steamApiKey, steamUserId) => {
  const installedGames = getInstalledSteamGames();
  const ownedGames = await getOwnedSteamGames(steamApiKey, steamUserId);

  console.log('Owned games:', ownedGames); // Add logging here

  const gamePromises = ownedGames.map(async (ownedGame) => {
    const installedGame = installedGames.find(g => g.appid === ownedGame.appid);
    const details = await getSteamGameDetails(ownedGame.appid);
    if (details) {
      const existingGame = await Game.findOne({ name: details.name });
      if (existingGame) {
        console.log(`Game already exists in DB: ${details.name}`);
        return; // Skip adding the game if it already exists
      }

      const gameData = {
        name: details.name,
        path: installedGame ? installedGame.path : 'Not Installed', // Provide default value for path
        metadata: {
          description: details.short_description,
          developers: Array.isArray(details.developers) ? details.developers.join(', ') : details.developers,
          publishers: Array.isArray(details.publishers) ? details.publishers.join(', ') : details.publishers,
          release_date: details.release_date.date,
          icon_url: `https://cdn.cloudflare.steamstatic.com/steam/apps/${ownedGame.appid}/${details.header_image.split('/').pop()}`, // Add icon URL
          genres: details.genres ? details.genres.map(genre => genre.description).join(', ') : '',
          platforms: details.platforms ? Object.keys(details.platforms).join(', ') : '',
          price: details.price_overview ? details.price_overview.final_formatted : 'Free',
          metacritic_score: details.metacritic ? details.metacritic.score : 'N/A', // Add Metacritic score
          steam_score: details.recommendations ? details.recommendations.total : 'N/A', // Add Steam score
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
    await delay(1000);
  });

  await Promise.all(gamePromises); // Wait for all promises to complete

  console.log('Finished scanning Steam games');
};

const updateSteamGames = async (steamApiKey, steamUserId) => {
  const games = await Game.find();
  console.log('Existing games:', games); // Add logging here

  const updatePromises = games.map(async (game) => {
    const details = await getSteamGameDetails(game.appid);
    if (details) {
      console.log(`Updating game: ${game.name}`); // Add logging here
      game.metadata.description = details.short_description;
      game.metadata.developers = Array.isArray(details.developers) ? details.developers.join(', ') : details.developers;
      game.metadata.publishers = Array.isArray(details.publishers) ? details.publishers.join(', ') : details.publishers;
      game.metadata.release_date = details.release_date.date;
      game.metadata.icon_url = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/${details.header_image.split('/').pop()}`; // Add icon URL
      game.metadata.genres = details.genres ? details.genres.map(genre => genre.description).join(', ') : '';
      game.metadata.platforms = details.platforms ? Object.keys(details.platforms).join(', ') : '';
      game.metadata.price = details.price_overview ? details.price_overview.final_formatted : 'Free';
      game.metadata.metacritic_score = details.metacritic ? details.metacritic.score : 'N/A'; // Add Metacritic score
      game.metadata.steam_score = details.recommendations ? details.recommendations.total : 'N/A'; // Add Steam score

      // Update the game data in MongoDB
      try {
        await game.save();
        console.log(`Game updated in DB: ${game.name}`);
      } catch (error) {
        console.error(`Error updating game in DB: ${game.name}`, error);
      }
    } else {
      console.log(`No details found for game: ${game.name}`); // Add logging here
    }
    await delay(1000); // Add delay between requests to avoid rate limiting
  });

  await Promise.all(updatePromises); // Wait for all promises to complete

  console.log('Finished updating Steam games');
};

const clearDatabase = async () => {
  try {
    await Game.deleteMany({});
    console.log('Database cleared');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

module.exports = { scanSteamGames, updateSteamGames, clearDatabase };