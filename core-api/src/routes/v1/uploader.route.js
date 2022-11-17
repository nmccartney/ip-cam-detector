const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const uploaderValidation = require('../../validations/uploader.validation');
const uploaderController = require('../../controllers/uploader.controller');

const router = express.Router();

router
    .route('/')
    .post(uploaderController.uploadFile)



module.exports = router;
