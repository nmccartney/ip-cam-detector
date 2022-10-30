const httpStatus = require('http-status');
const { Eval, Detection } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
// const Detection = require('./detection.service');
// const { detectionService } = require('./index');
// const { Detection } = require('../models');


const EVAL_API = `http://10.0.0.199:5000/`
const FS_API = `http://10.0.0.199:3000`

/**
 * Create a eval
 * @param {Object} evalBody
 * @returns {Promise<Eval>}
 */
const createEval = async (evalBody) => {
    // if (await Detection.isEmailTaken(detectionBody.email)) {
    //     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    // }

    let eval = await Eval.create(evalBody);

    // start eval job from eval service
    const url = `${EVAL_API}run?image=ftp-dir${evalBody.path}&eval=${eval.id}`;
    try {
        const response = await axios.get(url);
        console.log(`Got eval job: `, response.data.evalId);
        // could  update eval model  here or expect a new  request
    } catch (error) {
        if (error.response) {
            console.error('Core Eval-Service Response Error A: ', error.response.data.message);
        } else {
            console.error('Core Eval-Service Response Error B: ', error.code);
        }
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to start eval');
    }

    return eval
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
const queryEvals = async (filter, options) => {
    const evals = await Eval.paginate(filter, { sortBy: 'updatedAt:desc', ...options, populate: 'owner' });
    return evals;
};

/**
 * Get detection by id
 * @param {ObjectId} id
 * @returns {Promise<Detection>}
 */
const getEvalById = async (id) => {
    return Eval.findById(id);
};


/**
* Update detection by id
* @param {ObjectId} evalId
* @param {Object} updateBody
* @returns {Promise<Eval>}
*/
const updateEvalById = async (evalId, updateBody) => {
    console.log(`Got eval update request ${evalId} `)
    let eval = await getEvalById(evalId);
    if (!eval) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Eval not found');
    }

    // TODO:
    // if tags length is 0
    // no need on keeping the record or files
    // create promise all for deleting both files
    // then delete records for detection and evaluations
    if (Object.keys(updateBody.tags).length == 0) {
        console.log(`Zero tags found. Try removing all records...`)
        try {
            await cleanupAssociations(eval, updateBody.detection_path)
        } catch (error) {
            console.error('Clean up response Error: ', error);

            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to Clean up after zero tags found.');
        }
        return eval
    } else if (!isWatchingForTags(updateBody.tags, [])) {
        console.log(`No tags of any significance. Lets remove all records`)
        try {
            await cleanupAssociations(eval, updateBody.detection_path)
        } catch (error) {
            console.error('Clean up Response Error B: ', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to Clean up after zero tags found in watch list.', false, error);
        }
        return eval
    }

    // if (updateBody.email && (await Detection.isEmailTaken(updateBody.email, detectionId))) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    // }
    eval = Object.assign(eval, updateBody);
    eval.detection_path = eval.detection_path.replace('ftp-dir/', '')
    eval = await eval.save();

    console.log(`Saved eval: ${eval.id}`)

    return eval;
};

/**
 * Delete detection by id
 * @param {ObjectId} detectionId
 * @returns {Promise<Eval>}
 */
const deleteEvalById = async (detectionId) => {
    const eval = await getEvalById(detectionId);
    if (!eval) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Eval not found');
    }
    await eval.remove();
    return eval;
};

const isWatchingForTags = (tags, watchers) => {
    let shouldKeep = false
    let defaultWatchers = ['person', 'dog', 'cat', 'car', 'truck']
    watchers = [...watchers, ...defaultWatchers]

    tags = Object.keys(tags).filter(tag => {
        let index = watchers.indexOf(tag)
        return index > -1 ? true : false
    })

    console.log(`checking tags `, tags)

    return tags.length > 0 ? true : false
}


const cleanupAssociations = async (eval, detectionImage) => {

    // TODO: normalize these paths for each micro-service
    let originalImage = eval.path.replace('/ftp-dir/', '')
    detectionImage = detectionImage.replace('ftp-dir', '')

    console.log(`trying to delet orig: `, eval.path)
    console.log(`trying to delet det: `, detectionImage)

    const orgImage = `${FS_API}${originalImage}`;
    const detectImage = `${FS_API}${detectionImage}`;

    //  delete both assets
    // const response = await Promise.all([
    //     axios.delete(orgImage),
    //     axios.delete(detectImage)
    // ])
    // console.log(`Got Deleted asset  resp: `, response);

    try {
        await axios.delete(orgImage)
    } catch (err) {
        console.log(`delete origin image ${orgImage}`, err)
        throw new Error('failed delete orig image')

    }

    try {
        await axios.delete(detectImage)
    } catch (err) {
        console.log(`delete detect image ${detectImage}`, err)
        throw new Error('failed delete detect image')
    }

    // delete deletion record
    // await deleteDetectionById(eval.detectionId)
    let detection = await Detection.findById(eval.detectionId);
    if (!detection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found');
    }

    try {
        await detection.remove();
    } catch (err) {
        console.log(`Cleanup detection error: `, err)
        throw new ApiError(httpStatus.NOT_FOUND, `Failed to clean up detection: ${eval.detectionId}`);
    }

    //  delete eval record
    try {
        await deleteEvalById(eval.id)
    } catch (err) {
        console.log(`Cleanup eval error: `, err)
        throw new ApiError(httpStatus.NOT_FOUND, `Failed to clean up eval: ${eval.detectionId}`);
    }
}


module.exports = {
    createEval,
    queryEvals,
    getEvalById,
    updateEvalById,
    deleteEvalById,
};
