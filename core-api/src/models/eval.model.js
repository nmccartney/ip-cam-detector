const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const evalSchema = mongoose.Schema(
    {
        detectionId: {
            type: String,
            required: true,
            trim: true,
        },
        threadId: {
            type: String,
            trim: true,
        },
        tags: {
            type: Map,
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
        detection_path: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Detection"
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
evalSchema.plugin(toJSON);
evalSchema.plugin(paginate);

// /**
//  * Check if email is taken
//  * @param {string} email - The user's email
//  * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
//  * @returns {Promise<boolean>}
//  */
//  evalSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//     const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//     return !!user;
// };


// userSchema.pre('save', async function (next) {
//     const user = this;
//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8);
//     }
//     next();
// });

/**
 * @typedef Eval
 */
const Eval = mongoose.model('Eval', evalSchema);

module.exports = Eval;
