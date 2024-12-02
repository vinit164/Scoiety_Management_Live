const { Router } = require("express");
const wingController = require("../controllers/WingController");
const asyncHandler = require('express-async-handler');

const wingRouter = Router()

wingRouter.post("/create", asyncHandler(wingController.createWing))
wingRouter.get("/list/:societyId", asyncHandler(wingController.listWing))
wingRouter.get("/listbyid/:id", asyncHandler(wingController.getWingById))
wingRouter.delete("/delete/:id", asyncHandler(wingController.deleteWingById))

module.exports = wingRouter