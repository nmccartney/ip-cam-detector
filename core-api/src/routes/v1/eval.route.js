const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const evalValidation = require('../../validations/eval.validation');
const evalController = require('../../controllers/eval.controller');

const router = express.Router();

router
    .route('/')
    .get(validate(evalValidation.getEvals), evalController.getEvals);

router
    .route('/object')
    .post(validate(evalValidation.startObjectEval), evalController.startObjectEval)
    .get(validate(evalValidation.getEvals), evalController.getEvals);

router
    .route('/prediction')
    .post(validate(evalValidation.startPredictionEval), evalController.startPredictionEval)
    .get(validate(evalValidation.getEvals), evalController.getEvals);

router
    .route('/:evalId')
    .get(validate(evalValidation.getEval), evalController.getEval)
    .patch(validate(evalValidation.updateEval), evalController.updateEval)
    .delete(validate(evalValidation.deleteEval), evalController.deleteEval);

module.exports = router;
