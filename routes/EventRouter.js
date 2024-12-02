const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const eventController = require('../controllers/EventController');

const eventRouter = Router()

eventRouter.post("/create", asyncHandler(eventController.createEvent))
eventRouter.get("/:societyId", asyncHandler(eventController.listEvent))
eventRouter.get("/list/:eventId", asyncHandler(eventController.getEventById))
eventRouter.put("/update", asyncHandler(eventController.updateEvent))
eventRouter.delete("/delete/:eventId", asyncHandler(eventController.deleteEvent))

module.exports = eventRouter