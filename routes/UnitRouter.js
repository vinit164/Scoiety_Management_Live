const { Router } = require("express");
const unitController = require("../controllers/UnitController");
const asyncHandler = require('express-async-handler');

const unitRouter = Router()

unitRouter.post("/create", asyncHandler(unitController.createUnit))
unitRouter.get("/list/:wingId", asyncHandler(unitController.listUnit))
unitRouter.get("/listbyid/:id", asyncHandler(unitController.getUnitById))
unitRouter.delete("/delete/:id", asyncHandler(unitController.deleteUnitById))
unitRouter.get("/totalunit", asyncHandler(unitController.TotalUnit))

module.exports = unitRouter