const { Router } = require("express");
const importantController = require('../controllers/ImportantController')
const asyncHandler = require('express-async-handler');

const importantRouter = Router()

importantRouter.post("/create", asyncHandler(importantController.createWorkerNumber))
importantRouter.get("/list/:societyId", asyncHandler(importantController.getWorkerDetails))
importantRouter.delete("/delete/:id", asyncHandler(importantController.deleteWorkerDetails))
importantRouter.put('/updateimportantnumber/:id', asyncHandler(importantController.updateImportantNumber))

module.exports = importantRouter