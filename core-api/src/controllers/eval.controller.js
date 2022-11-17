const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { evalService } = require('../services');

const startObjectEval = catchAsync(async (req, res) => {
    const eval = await evalService.createEval({ ...req.body, type: 'object' });
    res.status(httpStatus.CREATED).send(eval);
});

const startPredictionEval = catchAsync(async (req, res) => {
    const eval = await evalService.createEval({ ...req.body, type: 'prediction' });
    res.status(httpStatus.CREATED).send(eval);
});

const getEvals = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await evalService.queryEvals(filter, options);
    res.send(result);
});

const getEval = catchAsync(async (req, res) => {
    const eval = await evalService.getEvalById(req.params.evalId);
    if (!eval) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Evval not found');
    }
    res.send(eval);
});

const updateEval = catchAsync(async (req, res) => {
    const eval = await evalService.updateEvalById(req.params.evalId, req.body);
    res.send(eval);
});

const deleteEval = catchAsync(async (req, res) => {
    await evalService.deleteEvalById(req.params.evalId);
    res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    startObjectEval,
    startPredictionEval,
    getEvals,
    getEval,
    updateEval,
    deleteEval,
};
