const httpStatus = require('http-status');
const { Eval, Detection } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
// const Detection = require('./detection.service');
// const { detectionService } = require('./index');
// const { Detection } = require('../models');


const EVAL_API = `http://10.0.0.106:5000/`
const FS_API = `http://10.0.0.106:3000`

/**
 * Create a eval
 * @param {Object} evalBody
 * @returns {Promise<Eval>}
 */
const createEval = async (evalBody) => {
    // TODO: currently createEval is trigger by
    // - Eval create - rest api
    // - Detection create - rest api
    // Find a better way to handle the assoication

    let detection

    if (!evalBody.status) {
        detection = await Detection.findById(evalBody.detectionId);
        if (!detection) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found:' + evalBody.detectionId);
        }
        console.log(`Eval body `, evalBody)
        // return {}
    }


    // console.log(`Start ${evalBody.type} Job for detection: `, detection)
    // // create new evaluation obj
    let newEvalBody = {
        ...evalBody,
        path: detection ? detection.path : evalBody.path,
        detectionId: detection ? detection._id : evalBody.detectionId,
        status: 'initialized',
        owner: detection ? detection._id : evalBody.detectionId,
        type: evalBody.type || 'object'
    }

    let eval = await Eval.create(newEvalBody);

    // start eval job from eval service
    const url = `${EVAL_API}run-${newEvalBody.type || 'object'}?image=ftp-dir${newEvalBody.path}&eval=${eval.id}`;
    try {
        console.log(`starting job `, url);
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

    if (!evalBody.status) {
        console.log(`Eval save detection with new eval `, eval)
        try {
            // update detection with new eval
            detection.evaluations = [...detection.evaluations, eval]
            await detection.save()
        } catch (err) {
            let error = Error(`Failed to update detction after starting job, ${err.message}`)
            console.error(`Core Eval: `, error)
            return eval
        }
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
    } else if (eval.type === "object" && !isWatchingForTags(updateBody.tags, [])) {
        console.log(`No tags of any significance. Lets remove all records`)
        try {
            await cleanupAssociations(eval, updateBody.detection_path)
        } catch (error) {
            console.error('Clean up Response Error B: ', error);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to Clean up after zero tags found in watch list.', false, error);
        }
        return eval
    }

    eval = Object.assign(eval, updateBody);
    eval.detection_path = eval.detection_path.replace('ftp-dir/', '')
    eval = await eval.save();

    console.log(`Saved eval: ${eval.id}`)

    let detection = await Detection.findById(eval.detectionId);
    if (!detection) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Detection not found');
    } else {
        try {
            detection.objectTags = [...new Set([...detection.objectTags, ...(Object.keys(updateBody.tags))])]
            detection = await detection.save();
        } catch (err) {
            console.log(`Error updating tags in detection: `, err)
        }
    }

    return eval;
};

/**
 * Delete detection by id
 * @param {ObjectId} detectionId
 * @returns {Promise<Eval>}
 */
const deleteEvalById = async (evalId) => {
    const eval = await getEvalById(evalId);
    if (!eval) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Eval not found');
    }

    if (eval.path) {
        try {
            let image = eval.path.replace('ftp-dir', '')
            image = `${FS_API}${image}`;
            await axios.delete(image)
        } catch (err) {
            console.log(`err: delete eval image ${orgImage}`, err)
            throw new Error('failed delete eval image')
        }
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
    // delete deletion record
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
}


module.exports = {
    createEval,
    queryEvals,
    getEvalById,
    updateEvalById,
    deleteEvalById,
};
