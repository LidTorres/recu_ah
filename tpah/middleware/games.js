import { gameCreateSchema, gameUpdateSchema } from "../schemas/games.js";

export function validateUpdateGame(req, res, next){
    gameUpdateSchema.validate(req.body, { })
    .then(async function(game){
        req.body = game;
        next();
    })
   .catch(function(err){
    res.status(400).json(err);
   })
}

export function validateCreateGame(req, res, next){
    gameCreateSchema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false
    })
    .then(async function(game){
        req.body = game;
        next();
    })
   .catch(function(err){
    res.status(400).json(err);
   })
}