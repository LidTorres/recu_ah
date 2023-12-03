import * as GamesService from "../services/games.js";

function getGames(req,res){

    GamesService.getGames(req.query)
    .then(function(games){
        res.status(200).json(games); 
    })
    .catch(function(err){
    res.status(500).json({msg: "no esta el archivo"});
})
}

function getGameByIDPoints(req,res){
    const {idGame} = req.params;
    
    GamesService.getGameByIDPoints(idGame)
    .then(function(game){
        console.log(game);
        return res.status(200).json(game)
    })
    .catch(function(err){
        if(err?.code){
            res.status(err.code).json({msg: err.msg});
        }
        else {
            res.status(500).json({msg: "no esta"});
        }

    })
}

function getGameByID(req,res){
    const {idGame} = req.params;
    
    GamesService.getGameByID(idGame)
    .then(function(game){
        console.log(game);
        return res.status(200).json(game)
    })
    .catch(function(err){
        if(err?.code){
            res.status(err.code).json({msg: err.msg});
        }
        else {
            res.status(500).json({msg: "no esta"});
        }
    })
}

async function createGame(req,res){
   return GamesService.createGame(req.body)
   .then(function(game){
    res.status(201).json(game)
   })
   .catch(function(err){
    res.status(500).json({ msg: err.msg });
   })
}

async function replaceGameByID(req, res) {
    const { idGame } = req.params;
    const replacedData = req.body;

    GamesService.replaceGameByID(idGame, replacedData)
        .then(function (game) {
            res.status(200).json(game);
        })
        .catch(function (err) {
            if (err?.code) {
                res.status(err.code).json({ msg: err.msg });
            } else {
                res.status(500).json({ msg: "no se actualizo" });
            }
        });
}

async function getGamesSortedByScore (req, res) {
    try {
        const { edition } = req.params;
        const { genre } = req.query;
        
        const games = await GamesService.getGamesSortedByScore(parseInt(edition), genre);
        res.json(games);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'no se consiguio' });
    }
  };

async function deleteGameByID(req,res) {
    const {idGame} = req.params;

    GamesService.deleteGameByID(idGame)
        .then(function (game) {
            res.status(200).json({ msg: "eliminado" });
        })
        .catch(function (err) {
            if (err?.code) {
                
                res.status(err.code).json({ msg: err.msg });
            } else {
                res.status(500).json({ msg: "eliminado" });
            }
        });
}

async function updateGameByID(req, res) {
    const { idGame } = req.params; 
    const updateData = req.body; 

    GamesService.updateGameByID(idGame, updateData)
        .then(function (game) {
            res.status(200).json(game);
        })
        .catch(function (err) {
            if (err?.code) {
                res.status(err.code).json({ msg: err.msg });
            } else {
                res.status(500).json({ msg: "no se actualizo" });
            }
        });
}
  

export {
    getGames,
    getGameByID,
    createGame,
    replaceGameByID,
    updateGameByID,
    getGamesSortedByScore,
    deleteGameByID,
    getGameByIDPoints
}

export default{
    getGames,
    getGameByID,
    getGamesSortedByScore,
    replaceGameByID,
    createGame,
    updateGameByID,
    deleteGameByID,
    getGameByIDPoints
}