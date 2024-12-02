const { Router } = require("express");
const societyController = require("../controllers/SocietyController");
const asyncHandler = require('express-async-handler');

const societyRouter = Router()

societyRouter.post("/create", asyncHandler(societyController.createSociety))
societyRouter.get("/list", asyncHandler(societyController.listSociety))
societyRouter.get("/listbyid/:id", asyncHandler(societyController.getSocietyById))
societyRouter.delete("/delete/:id", asyncHandler(societyController.deleteSocietyById))

module.exports = societyRouter