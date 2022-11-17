const httpStatus = require('http-status');
const { Eval, Detection } = require('../models');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
// const Detection = require('./detection.service');
// const { detectionService } = require('./index');
// const { Detection } = require('../models');
const FormData = require('form-data');

const stream = require('stream');

const { Duplex } = stream;

function bufferToStream(buffer) {
    const duplexStream = new Duplex();
    duplexStream.push(buffer);
    duplexStream.push(null);
    return duplexStream;
}

const EVAL_API = `http://10.0.0.199:5000/`
const FS_API = `http://10.0.0.199:3000`

/**
 * Create a file
 * @param {Object} body
 * @returns {Promise<Eval>}
 */
const uploadFile = async (file) => {
    console.log(`Got upload `, file)

    try {
        // const resp = await axios.post(`${FS_API}/uploades/${file.originalname || 'upload.jpg'}`, file)
        // var formData = new FormData();
        // formData.append("file", file.buffer.toString('utf8'));

        file = {
            ...file,
            filename: file.originalname.split(' ').join('_'),
            fieldname: 'file',
            originalname: file.originalname.split(' ').join('_'),
            name: file.originalname.split(' ').join('_'),
            size: file.size,
            // path_on_disk: file.path,
            // identifier: identifier,
            // encoding: 'base64',
            mimetype: file.mimetype,
            buffer: file.buffer//.toString('base64')//Buffer.from(file.buffer.toString('base64'), 'base64')
        };

        console.log(`Uploading: ${FS_API}/uploads/${file.originalname}`, file)

        let config = {
            headers: {
                'Content-Type': `multipart/form-data;`//boundary=${formData.getBoundary()}`
            }
        }

        const formData = {
            file: file.toString('utf8')
            // file: {
            //     value: bufferToStream(file.buffer),
            //     options: {
            //         filename: file.originalname,
            //         contentType: file.mimetype,
            //         knownLength: file.size,
            //     },
            // },
            // image: file.buffer,
            // content: file.buffer//Buffer.from(file.buffer, '7bit')//bufferToStream(file.buffer),
            // Buffer.from(file.buffer.toString('base64'), 'base64'),
            // encoding: 'base64'
            // file
            // file
            // file: {
            //     value: bufferToStream(file.buffer),
            //     options: {
            //         filename: file.originalname,
            //         contentType: file.mimetype,
            //         knownLength: file.size,
            //     },
            // },
        };

        const resp = await axios.post(`${FS_API}/uploads/${file.originalname}`, formData, config);

        console.log(`go image upload response from fs service `, resp.data)

        // const stats = await axios.get(`${FS_API}/uploads/${file.originalname || 'upload.jpg'}&stat=true`);
        // console.log(`stats `, stats.data)

    } catch (err) {
        console.log(err.message)
        console.log(err.response.data.message)
        let mess = 'cannot place upload'
        try { mess = err.response.data.message } catch (err) { }
        throw new ApiError(httpStatus.BAD_REQUEST, mess);
    }
};


module.exports = {
    uploadFile,
};
