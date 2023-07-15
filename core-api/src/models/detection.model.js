const mongoose = require('mongoose');
// const validator = require('validator');
const Eval = require('./eval.model');
const { toJSON, paginate } = require('./plugins');
const axios = require('axios');

const detectionSchema = mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        ext: {
            type: String,
            trim: true,
            lowercase: true,
        },
        path: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
        },
        evaluatedObjectPath: {
            type: String,
            trim: true,
        },
        evaluatedOPredictionPath: {
            type: String,
            trim: true,
        },
        objectTags: {
            type: [String],
            trim: true,
        },
        predictTags: {
            type: Object,
            trim: true,
        },
        evaluations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Eval"
        }]
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
detectionSchema.plugin(toJSON);
detectionSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} path - The detections's path
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
detectionSchema.statics.isPathTaken = async function (path, excludeUserId) {
    const detection = await this.findOne({ path, _id: { $ne: excludeUserId } });
    return !!detection;
};

const FS_API = `http://10.0.0.106:3000`

detectionSchema.pre('remove', async function (next) {
    const detection = this;

    try {
        await Eval.deleteMany({ detectionId: detection.id })
    } catch (err) {
        console.log(`Clean Up Error: delete evaluations ${detection.id}`, err)
    }

    // if (detection.path) {
    //     let originalImage = detection.path.replace('/ftp-dir/', '')
    //     originalImage = `${FS_API}${originalImage}`

    //     // first check if file exists
    //     console.log(`checking if file exists`, originalImage)
    //     try {
    //         let doesExist = await axios.get(originalImage).catch(err => {
    //             console.log('error from checking image ', err)
    //             return false
    //         })
    //         doesExist = doesExist ? true : false
    //         console.log(`---exists`, doesExist)
    //     } catch (err) {
    //         console.log(`1Clean Up Error: delete detection image ${originalImage}`, err.data)
    //         // return next(err);
    //         next()
    //     }
    //     // try deleteing
    //     try {
    //         await axios.delete(originalImage)
    //     } catch (err) {
    //         console.log(`2Clean Up Error: delete detection image ${originalImage}`, err.data)
    //         // return next(err);
    //     }
    // }
    next();
});

/**
 * @typedef Detection
 */
const Detection = mongoose.model('Detection', detectionSchema);

module.exports = Detection;
