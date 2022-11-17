const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { uploaderService } = require('../services');

const uploadFile = catchAsync(async (req, res) => {
    const file = await uploaderService.uploadFile(req.file);
    res.status(httpStatus.CREATED).send(req.body);
});


module.exports = {
    uploadFile,
};
