import express from 'express';
import GamesVotosController from '../controllers/gamesVotos.js';
import { validateCreateVoto } from '../middleware/votos.js';

const route = express.Router();

route.get('/judges/', GamesVotosController.getJudges);
route.get('/judges/:idJudge/votos', GamesVotosController.getVotosByJudge);
route.post('/judges/:idJudge/votos/:idGame',[validateCreateVoto], GamesVotosController.createVoto);

export default route;