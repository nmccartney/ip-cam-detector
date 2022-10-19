const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const triggerValidation = require('../../validations/trigger.validation');
const triggerController = require('../../controllers/trigger.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(triggerValidation.createTrigger), triggerController.createTrigger)
    .get(validate(triggerValidation.getTriggers), triggerController.getTriggers);

router
    .route('/:triggerId')
    .get(validate(triggerValidation.getTrigger), triggerController.getTrigger)
    .patch(validate(triggerValidation.updateTrigger), triggerController.updateTrigger)
    .delete(validate(triggerValidation.deleteTrigger), triggerController.deleteTrigger);

module.exports = router;
