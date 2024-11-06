const router = require('express').Router();
let Game = require('../models/game.model');

// Get all games
router.route('/').get((req, res) => {
  Game.find()
    .then(games => res.json(games))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Add a new game
router.route('/add').post((req, res) => {
  const name = req.body.name;
  const path = req.body.path;
  const metadata = req.body.metadata;

  const newGame = new Game({ name, path, metadata });

  newGame.save()
    .then(() => res.json('Game added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get a game by ID
router.route('/:id').get((req, res) => {
  Game.findById(req.params.id)
    .then(game => res.json(game))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a game by ID
router.route('/:id').delete((req, res) => {
  Game.findByIdAndDelete(req.params.id)
    .then(() => res.json('Game deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a game by ID
router.route('/update/:id').post((req, res) => {
  Game.findById(req.params.id)
    .then(game => {
      game.name = req.body.name;
      game.path = req.body.path;
      game.metadata = req.body.metadata;

      game.save()
        .then(() => res.json('Game updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;