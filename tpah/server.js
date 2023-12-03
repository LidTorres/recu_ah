import express from 'express';
import GamesRoute from './routes/games.js';
import GamesVotosRoute from './routes/gamesVotos.js';
const app = express();
app.use(express.json());
app.use(GamesRoute);
app.use(GamesVotosRoute);

app.listen(2023, function () {
    console.log("El servidor esta levantado! http://localhost:2023");
});