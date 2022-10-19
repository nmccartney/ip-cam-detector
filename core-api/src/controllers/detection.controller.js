const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { detectionService } = require('../services');

const createDetection = catchAsync(async (req, res) => {
  const detection = await detectionService.createDetection(req.body);
  res.status(httpStatus.CREATED).send(detection);
});

const getDetections = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await detectionService.queryDetections(filter, options);
  res.send(result);
});

const getDetection = catchAsync(async (req, res) => {
  const detection = await detectionService.getDetectionById(req.params.detectionId);
  if (!detection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found');
  }
  res.send(detection);
});

const updateDetection = catchAsync(async (req, res) => {
  const detection = await detectionService.updateDetectionById(req.params.detectionId, req.body);
  res.send(detection);
});

const deleteDetection = catchAsync(async (req, res) => {
  await detectionService.deleteDetectionById(req.params.detectionId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
    createDetection,
    getDetections,
    getDetection,
    updateDetection,
    deleteDetection,
};
