const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createDetection = {
    body: Joi.object().keys({
        path: Joi.string().required(),
        fileName: Joi.string(),
        ext: Joi.string(),
    }),
};

const getDetections = {
    query: Joi.object().keys({
        dir: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    }),
};

const getDetction = {
    params: Joi.object().keys({
        detectionId: Joi.string().custom(objectId),
    }),
};

const updateDetection = {
    params: Joi.object().keys({
        detectionId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            // path: Joi.string().required(),
            // fileName: Joi.string().required(),
            // ext: Joi.string().required(),
            status: Joi.string().required(),
        })
        .min(1),
};

const deleteDetection = {
    params: Joi.object().keys({
        detectionId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createDetection,
    getDetections,
    getDetction,
    updateDetection,
    deleteDetection,
};
