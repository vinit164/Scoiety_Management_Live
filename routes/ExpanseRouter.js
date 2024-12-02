const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const expanseController = require("../controllers/ExpanseController");
const multer = require('multer');
const { storage } = require("../cloudinaryConfig");
const upload = multer({ storage })

const expanseRouter = Router()

expanseRouter.post("/create", upload.single('file'), asyncHandler(expanseController.createExpanses))
expanseRouter.put("/update/:expanseId", upload.single('file'), asyncHandler(expanseController.updateExpanse))
expanseRouter.get("/list/:societyId", asyncHandler(expanseController.listExpanses))
expanseRouter.get("/listbyid/:expanseId", asyncHandler(expanseController.listById))
expanseRouter.delete("/delete/:expanseId", asyncHandler(expanseController.deleteExpanse))
expanseRouter.get("/totalexpanse", asyncHandler(expanseController.totalExpanse))

module.exports = expanseRouter