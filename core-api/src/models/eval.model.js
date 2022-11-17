const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const axios = require('axios');

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
        },
        type: {
            type: String,
            trim: true,
        },
        path: {
            type: String,
            required: true,
            trim: true,
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


const FS_API = `http://10.0.0.199:3000`

evalSchema.pre('remove', async function (next) {
    const eval = this;
    if (eval.detection_path) {
        let originalImage = eval.detection_path.replace('/ftp-dir/', '')
        const orgImage = `${FS_API}${originalImage}`;
        try {
            await axios.delete(orgImage)
        } catch (err) {
            console.log(`Clean Up Error: delete eval image`, err)
            return next();
        }
    }
    next();
});

evalSchema.pre('deleteMany', async function (next) {
    try {
        let deletedData = await Eval.find(this._conditions).lean()

        let images = deletedData.map(eval => {
            let originalImage = eval.detection_path.replace('/ftp-dir/', '')
            const orgImage = `${FS_API}/${originalImage}`;
            return orgImage
        }).filter((item, pos, self) => {
            return self.indexOf(item) == pos;
        })

        let imagePromises = images.map(img => axios.delete(img))
        await Promise.all(imagePromises)

        // deletedData.forEach(async (item) => {
        //     if (item.detection_path) {
        //         let originalImage = item.detection_path.replace('/ftp-dir/', '')
        //         const orgImage = `${FS_API}/${originalImage}`;
        //         console.log(`checking image for eval`, orgImage)
        //         const doesExist = await axios.get(orgImage).catch(err => {
        //             console.log('error from checking image ', err)
        //             return false
        //         })
        //         if (doesExist.data) { await axios.delete(orgImage) }
        //     }
        // })

    } catch (error) {
        console.log(`Clean Up Error: delete eval image`, error)
        return next();
    }
    return next();
});

/**
 * @typedef Eval
 */
const Eval = mongoose.model('Eval', evalSchema);

module.exports = Eval;
