const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const detectionValidation = require('../../validations/detection.validation');
const detectionController = require('../../controllers/detection.controller');

const router = express.Router();

router
    .route('/')
    .post(validate(detectionValidation.createDetection), detectionController.createDetection)
    .get(validate(detectionValidation.getDetections), detectionController.getDetections);

router
    .route('/:detectionId')
    .get(validate(detectionValidation.getDetection), detectionController.getDetection)
    .patch(validate(detectionValidation.updateDetection), detectionController.updateDetection)
    .delete(validate(detectionValidation.deleteDetection), detectionController.deleteDetection);

module.exports = router;



// EXAMPLES:

// router
//   .route('/')
//   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);