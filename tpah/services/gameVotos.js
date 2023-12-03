import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient('mongodb://127.0.0.1:27017');
const db = client.db("datos");
const GameVotosCollection = db.collection('votos');
const JudgesCollection = db.collection('judges');
const GameCollection = db.collection('games');

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

async function getJudges(filter = {}) {
    await client.connect();
    const filterValido = filterQueryToMongo(filter);
    return JudgesCollection.find(filterValido).toArray();
}

async function getJudgeByID(id){
    await client.connect();
    const idJ = JudgesCollection.findOne({_id: new ObjectId(id)});
    console.log(idJ);
    return idJ;
}

async function findVotosByJudge(idJudge){
    await client.connect();
    const judge = await JudgesCollection.findOne({_id: new ObjectId(idJudge)});

    return GameVotosCollection.find({judge_name: judge.name}).toArray();
}

async function findVotosByGame(idGame){
    await client.connect();
    return GameVotosCollection.find({game_id: new ObjectId(idGame)}).toArray();
}


async function createVoto(idGame, idJudge, voto) { 
    await client.connect();
    try {
        const game = await GameCollection.findOne({ _id: new ObjectId(idGame) });
        const judge = await JudgesCollection.findOne({ _id: new ObjectId(idJudge) }); 
        if (!game || !judge) {
            throw error;
        }
        const newVoto = {
            ...voto,
            game_name: game.name,
            judge_name: judge.name,
        }
        const votosByJudge = await findVotosByJudge(idJudge);
        console.log("votos:", votosByJudge);
        let gameID;
        const votoExists = votosByJudge.some( (document) => {
            gameID = document.game_name;
            console.log("existe:" , gameID );
            return gameID === game.name;
        });

        if (votoExists) {
            console.log("Hola: ", idGame);
            throw new Error("ya voto");
        } else {
            console.log("llegué al else");
            await GameVotosCollection.insertOne(newVoto);
        }
        
        return newVoto;
    } catch (error) {
        throw error; 
    }
}

export default {
    findVotosByJudge,
    findVotosByGame,
    createVoto,
    getJudges,
    getJudgeByID,
    getGames
}