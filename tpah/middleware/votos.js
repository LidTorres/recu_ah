import { votoCreateSchema } from "../schemas/votos.js";

export function validateCreateVoto(req, res, next){
        votoCreateSchema.validate(req.body, {
            stripUnknown: true,
            abortEarly: false
        })
        .then(async function(voto){
            req.body = voto;
            next();
        })
       .catch(function(err){
        res.status(400).json(err);
       })
}