import { MongoClient, ObjectId } from "mongodb";
const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db("datos");
const GameCollection = db.collection('games');
const VotosCollection = db.collection('votos');

function filterQueryToMongo(filter){
    const filterMongo = {};
    
    for(const filed in filter){
        if(isNaN(filter[filed])){
            filterMongo[filed] = filter[filed];
        }
        else {
            const [field, op] = filed.split('_');

            if(!op){
                filterMongo[filed] = parseInt(filter[filed]);
            }
            else {
                if(op === 'min'){
                    filterMongo[field] = {
                        $gte: parseInt(filter[filed])
                    }
                }
                else if(op === 'max'){
                    filterMongo[field] = {
                        $lte: parseInt(filter[filed])
                    }
                }
            }
        }
    }    
    return filterMongo;
}

async function getGames(filter = {}) {
    await client.connect();
    const filterValido = filterQueryToMongo(filter);
    return GameCollection.find(filterValido).toArray();
}

async function getGameByID(id){
    await client.connect();
    const game = await GameCollection.findOne({_id: new ObjectId(id)});
    let gameName = game.name;
    const votos = await VotosCollection.find({ game_name: gameName }).toArray();
    let jugabilidad = 0;
    let arte = 0;
    let sonido = 0;
    let tematica = 0;  

    votos.forEach(g => {
        jugabilidad += g.Jugabilidad;
        arte += g.Arte;
        sonido += g.Sonido;
        tematica += g.Tematica;
        
    }) 
    const object = {
        ...game,
        "puntaje": {
            Jugabilidad: jugabilidad/(votos.length),
            Arte: arte/(votos.length),
            Sonido: sonido/(votos.length),
            Tematica: tematica/(votos.length),
            }
    }
    console.log(game);
   return object
}

async function getGameByIDPoints(id){
    await client.connect();

    const game = await GameCollection.findOne({_id: new ObjectId(id)});
    let gameName = game.name;
    const votos = await VotosCollection.find({ game_name: gameName }).toArray();

     const object = {
         ...votos,     
     }
    console.log(game);
    return object
}

async function createGame(game){
    await client.connect();
    const newGame = { ...game};
    await GameCollection.insertOne(newGame);
    return game;
}

async function updateGameByID(id, updateData){
    await client.connect();
    const result = await GameCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    if (result.matchedCount === 1) {
        return GameCollection.findOne({_id: new ObjectId(id)});
    } 
}

async function replaceGameByID(id, replacedData) {
    await client.connect();
    const result = await GameCollection.replaceOne({ _id: new ObjectId(id) }, replacedData);
    if (result.matchedCount === 1) {
        return GameCollection.findOne({_id: new ObjectId(id)});
    }
}

const getGamesSortedByScore = async (edition, genre) => {
    try {
        await client.connect();
        const games = await GameCollection.find({ edition: edition }).toArray();
        const votosPromises = games.map(async (game) => {
            const votos = await VotosCollection.find({ game_name: game.name }).toArray();
            game.votos = votos; 
            return game;
        });
        const gamesWithVotos = await Promise.all(votosPromises);
        gamesWithVotos.forEach((game) => {
        game.score = game.votos.reduce((acc, voto) => acc + voto.Jugabilidad + voto.Arte + voto.Sonido + voto.Tematica, 0);
        });

        gamesWithVotos.forEach((game) => {
            delete game.votos;
        });

        const gamesSorted = gamesWithVotos.sort((a, b) => b.score - a.score);

        let allGames;

        if(genre){
            allGames = gamesSorted.filter((game) => {
                return game.genre == genre;
            });
            if(!allGames.length >= 1){
                throw error;
            }
           console.log("dentro del genero: ", allGames);
        }else {
            allGames = gamesSorted;
        }

        client.close();
        console.log("incia: ", gamesSorted);

        return allGames;
      
    } catch (error) {
        console.error('error:', error);
        throw error; 
    }
  };

async function deleteGameByID(id){
    try {
            await client.connect();
            const game = await GameCollection.findOne({ _id: new ObjectId(id) });
        console.log(game);
            game.deleted = true; 
            const resultado = await GameCollection.deleteOne({_id: new ObjectId(game._id)});
            console.log(resultado);
            if (resultado.deletedCount === 1) {
                return resultado;
            }else{
                throw error;
            }   
        }
        catch (error) {
        console.error('Error:', error);
        throw error; 
    }

}

export {
    getGames,
    getGameByID,
    createGame,
    updateGameByID,
    replaceGameByID,
    getGamesSortedByScore,
    getGameByIDPoints,
    deleteGameByID
}

export default {
    getGames,
    getGameByID,
    createGame,
    updateGameByID,
    replaceGameByID,
    getGamesSortedByScore,
    getGameByIDPoints,
    deleteGameByID
}
