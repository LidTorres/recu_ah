import express from 'express';
import GamesController from '../controllers/games.js'
import { validateCreateGame, validateUpdateGame } from '../middleware/games.js';

const route = express.Router();
route.get('/:idGame/points', GamesController.getGameByIDPoints);
route.get('/games/edition/:edition', GamesController.getGamesSortedByScore);
route.patch('/games/:idGame', [validateUpdateGame], GamesController.updateGameByID);
route.put('/games/:idGame',[validateCreateGame], GamesController.replaceGameByID);
route.get('/games/:idGame', GamesController.getGameByID);
route.get('/games', GamesController.getGames);
route.post('/games',[validateCreateGame], GamesController.createGame);
route.delete('/games/:idGame', GamesController.deleteGameByID);

export default route;