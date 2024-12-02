const { Router } = require("express");
const societyHandlerController = require("../controllers/SocietyHandlerController");
const asyncHandler = require('express-async-handler');

const societyHandlerRouter = Router()

societyHandlerRouter.post("/create", asyncHandler(societyHandlerController.createChairman))

module.exports = societyHandlerRouter