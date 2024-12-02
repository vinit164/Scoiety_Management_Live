const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const announcementController = require("../controllers/AnnouncementController");

const announcementRouter = Router()

announcementRouter.post("/create", asyncHandler(announcementController.createAnnouncement))
announcementRouter.get("/list/:societyId", asyncHandler(announcementController.listAnnouncement))
announcementRouter.get("/listbyid/:id", asyncHandler(announcementController.listById))
announcementRouter.put("/update/:id", asyncHandler(announcementController.updateAnnouncement))
announcementRouter.delete("/delete/:id", asyncHandler(announcementController.deleteAnnouncement))

module.exports = announcementRouter