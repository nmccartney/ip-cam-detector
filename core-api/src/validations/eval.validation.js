const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const startObjectEval = {
    query: Joi.object().keys({
        detectionId: Joi.string().custom(objectId),
    }),
};

const startPredictionEval = {
    query: Joi.object().keys({
        detectionId: Joi.string().custom(objectId),
    }),
};

const getEvals = {
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getEval = {
    params: Joi.object().keys({
        evalId: Joi.string().custom(objectId),
    }),
};

const updateEval = {
    params: Joi.object().keys({
        evalId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            detection_path: Joi.string(),
            tags: Joi.object(),
            // tags: Joi.object({
            //     "probability": Joi.string(),
            //     "boundries": Joi.array().items(Joi.number())
            // }),
            status: Joi.string(),//.required(),
            message: Joi.string(),
            threadId: Joi.string()
        })
        .min(1),
};

const deleteEval = {
    params: Joi.object().keys({
        evalId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    startObjectEval,
    startPredictionEval,
    getEvals,
    getEval,
    updateEval,
    deleteEval,
};
