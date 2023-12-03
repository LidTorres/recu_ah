import GameVotosService from '../services/gameVotos.js';

function getGames(req,res){

    GameVotosService.getGames(req.query)
    .then(function(games){
        res.status(200).json(games); 
    })
    .catch(function(err){
    res.status(500).json({msg: "no se encontro"});
})
}

function getJudges(req,res){
    const {idJudge} = req.params;

    GameVotosService.getJudges(idJudge)
    .then(function(judges){
        res.json(judges)
    })
    .catch(function (err) {
        res.status(500).json({msg: err.msg})
    })
}

function getJudgeByID(req,res){
    const {idJudge} = req.params;
    
    GameVotosService.getJudgeByID(idJudge)
    .then(function(judge){
        return res.status(200).json(judge)
    })
    .catch(function(err){
        if(err?.code){
            res.status(err.code).json({msg: err.msg});
        }
        else {
            res.status(500).json({msg: "no se consiguio"});
        }

    })
}

function createVoto(req,res){
    
    const {idGame} = req.params;
    const {idJudge} = req.params;

    GameVotosService.createVoto(idGame, idJudge, req.body)
    .then(function(votos){
        
        res.json(votos)
    })
    .catch(function (err) {
        res.status(500).json({msg: "no se pudo"})
    })
}

function getVotosByJudge(req,res){
   
    const {idJudge} = req.params;

    GameVotosService.findVotosByJudge(idJudge)
    .then(function(votos){
        res.json(votos)
    })
    .catch(function (err) {
        res.status(500).json({msg: err.msg})
    })
}

function getVotosByGame(req,res){
   
    const {idGame} = req.params;

    GameVotosService.findVotosByGame(idGame)
    .then(function(votos){
        res.json(votos)
    })
    .catch(function (err) {
        res.status(500).json({msg: err.msg})
    })
}

export default {
    getVotosByJudge,
    getVotosByGame,
    createVoto,
    getJudges,
    getJudgeByID,
    getGames
}