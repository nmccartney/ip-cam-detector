const httpStatus = require('http-status');
const { Eval } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');

const EVAL_API = `http://10.0.0.199:5000/`

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
        console.log(`Got eval job: `, response.data);
        // could  update eval model  here or expect a new  request
    } catch (error) {
        if (error.response) {
            console.error('Core Eval-Service Response Error A: ', error.response.data.message);
        } else {
            console.error('Core Eval-Service Response Error B: ', error.code);

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
    const evals = await Eval.paginate(filter, options);
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
    console.log(`Got eval update request ${evalId} `, updateBody)
    let eval = await getEvalById(evalId);
    if (!eval) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Eval not found');
    }

    // TODO:
    // if tags length is 0
    // no need on keeping the record or files
    // create promise all for deleting both files
    // then delete records for detection and evaluations

    //TODO:
    // if tags exist get  watchable tags
    // if watchable taks are not preset
    //  delete files and  records (see above todo)

    // if (updateBody.email && (await Detection.isEmailTaken(updateBody.email, detectionId))) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    // }
    eval = Object.assign(eval, updateBody);
    await eval.save();
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

module.exports = {
    createEval,
    queryEvals,
    getEvalById,
    updateEvalById,
    deleteEvalById,
};
