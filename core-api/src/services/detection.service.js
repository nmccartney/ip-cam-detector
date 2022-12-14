const httpStatus = require('http-status');
const { Detection } = require('../models');
const Eval = require('./eval.service');
const ApiError = require('../utils/ApiError');
const axios = require('axios');

/**
 * Create a detection
 * @param {Object} detectionBody
 * @returns {Promise<Detection>}
 */
const createDetection = async (detectionBody) => {
    // if (await Detection.isEmailTaken(detectionBody.email)) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    // }

    // create detection 
    let detection = await Detection.create({ ...detectionBody, status: 'initialized' });

    // create new evaluation obj
    let evalBody = {
        path: detectionBody.path,
        detectionId: detection._id,
        status: 'initialized',
        owner: detection._id
    }

    // start Eval on detection
    try {
        let eval = await Eval.createEval(evalBody)
        // update detection with new eval
        detection.evaluations = [eval.id]
        await detection.save()
    } catch (err) {
        let error = Error(`Failed to initate evaluation job, ${err.message}`)
        console.error(`Core Detection: `, error)
        return detection
    }

    return detection
};

/**
* Query for detections
* @param {Object} filter - Mongo filter
* @param {Object} options - Query options
* @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
* @param {number} [options.limit] - Maximum number of results per page (default = 10)
* @param {number} [options.page] - Current page (default = 1)
* @returns {Promise<QueryResult>}
*/
const queryDetections = async (filter, options) => {
    console.log(`filter `, filter)

    if (filter.objectTags) {
        filter.objectTags = { $all: filter.objectTags }
    }

    if (filter.fromTime) {
        // filter.fromTime = { $all: filter.objectTags }
    }
    if (filter.toTime) {
        // filter.fromTime = { $all: filter.objectTags }
    }

    const detections = await Detection.paginate(filter, {
        sortBy: 'createdAt:desc',
        ...options,
        populate: 'evaluations'
    });

    // console.log('--- ', detections.results)


    return detections;
};

/**
 * Get detection by id
 * @param {ObjectId} id
 * @returns {Promise<Detection>}
 */
const getDetectionById = async (id) => {
    return Detection.findById(id);
};


/**
* Update detection by id
* @param {ObjectId} detectionId
* @param {Object} updateBody
* @returns {Promise<Detection>}
*/
const updateDetectionById = async (detectionId, updateBody) => {
    const detection = await getDetectionById(detectionId);
    if (!detection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found');
    }
    // if (updateBody.email && (await Detection.isEmailTaken(updateBody.email, detectionId))) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    // }
    Object.assign(detection, updateBody);
    await detection.save();
    return detection;
};

/**
 * Delete detection by id
 * @param {ObjectId} detectionId
 * @returns {Promise<Detection>}
 */
const deleteDetectionById = async (detectionId) => {
    const detection = await getDetectionById(detectionId);
    if (!detection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found');
    }

    await detection.remove();
    return detection;
};


const cleanUp = async () => {

    let detections = await Detection.find()

    var date = new Date();
    const FIVE_MIN = 5 * 60 * 1000;
    const THIRTY_MINS = 30 * 60 * 1000;
    const TWOWEEKS = 1.2096e+9
    oldDetections = detections.filter(d => {
        if ((date - new Date(d.createdAt)) > THIRTY_MINS) {
            // console.log('Delayed by more than 5 mins');
            return d
        }
    });

    console.log(`detections to delete ${oldDetections.length}/${detections.length}`)

    let deletePromises = oldDetections.map((det) => {
        return det.remove()
    })

    try {
        await Promise.all(deletePromises)
    } catch (err) {
        console.log(`Cleanup detections  error: `, err)
        // throw new ApiError(httpStatus.NOT_FOUND, `Failed to clean up detections`);
    }

    return { success: true }
}

module.exports = {
    createDetection,
    queryDetections,
    getDetectionById,
    updateDetectionById,
    deleteDetectionById,
    cleanUp
};
