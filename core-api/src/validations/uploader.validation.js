const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const uploadFile = {
    body: Joi.object().keys({
        path: Joi.string().required(),
        fileName: Joi.string(),
        ext: Joi.string(),
    }),
};

module.exports = {
    uploadFile
};
