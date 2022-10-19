const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

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
            //   validate(value) {
            //     if (!validator.isEmail(value)) {
            //       throw new Error('Invalid email');
            //     }
            //   },
        },
        path: {
            type: String,
            required: true,
            trim: true,
            //   validate(value) {
            //     if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            //       throw new Error('Password must contain at least one letter and one number');
            //     }
            //   },
            //   private: true, // used by the toJSON plugin
        },
        status: {
            type: String,
            required: true,
            trim: true,
        },
        evaluations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Eval"
        }],
        evaluatedObjectPath: {
            type: String,
            trim: true,
        },
        evaluatedOPredictionPath: {
            type: String,
            trim: true,
        },
        objectTags: {
            type: Object,
            trim: true,
        },
        predictTags: {
            type: Object,
            trim: true,
        },
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


// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

/**
 * @typedef Detection
 */
const Detection = mongoose.model('Detection', detectionSchema);

module.exports = Detection;
