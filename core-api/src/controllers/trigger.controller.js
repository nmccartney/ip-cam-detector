const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
// const { userService } = require('../services');

const createTrigger = catchAsync(async (req, res) => {
    // const user = await userService.createUser(req.body);
    // res.status(httpStatus.CREATED).send(user);

    res.status(httpStatus.NO_CONTENT).send({status:"ok",in_progress:true});
});

const getTriggers = catchAsync(async (req, res) => {
    // const filter = pick(req.query, ['name', 'role']);
    // const options = pick(req.query, ['sortBy', 'limit', 'page']);
    // const result = await userService.queryUsers(filter, options);
    // res.send(result);

    res.status(httpStatus.NO_CONTENT).send({status:"ok",in_progress:true});
});

const getTrigger = catchAsync(async (req, res) => {
    // const user = await userService.getUserById(req.params.userId);
    // if (!user) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    // }
    // res.send(user);

    res.status(httpStatus.NO_CONTENT).send({status:"ok",in_progress:true});
});

const updateTrigger = catchAsync(async (req, res) => {
    // const user = await userService.updateUserById(req.params.userId, req.body);
    // res.send(user);

    res.status(httpStatus.NO_CONTENT).send({status:"ok",in_progress:true});
});

const deleteTrigger = catchAsync(async (req, res) => {
    // await userService.deleteUserById(req.params.userId);
    // res.status(httpStatus.NO_CONTENT).send();

    res.status(httpStatus.NO_CONTENT).send({status:"ok",in_progress:true});
});

module.exports = {
    createTrigger,
    getTriggers,
    getTrigger,
    updateTrigger,
    deleteTrigger,
};
