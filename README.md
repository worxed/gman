# Game Manager Project

The Game Manager project is a system based on React and MongoDB. It scans through installed games on the local computer via a Node.js server and stores specific metadata and configurations of these games.

## Project Structure

gman/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── games.js
│   └── models/
│       └── game.model.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── GameList.js
│   │   ├── GameItem.js
│   │   └── index.js
│   └── package.json
├── README.md
└── package.json

Summary
The backend is set up with Express.js and MongoDB.
The frontend is set up with React.
Basic CRUD operations for games are implemented.
The frontend displays a list of games retrieved from the backend.
This document summarizes the progress of