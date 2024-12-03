const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const eventDetilsController = require('../controllers/EventDetailsController');

const eventDetailsRouter = Router()

eventDetailsRouter.get("/:societyId", asyncHandler(eventDetilsController.listEventDetails))
eventDetailsRouter.get("/list/:eventId", asyncHandler(eventDetilsController.listDetailsByEvent))
eventDetailsRouter.put("/update", asyncHandler(eventDetilsController.updateEventDetails))
eventDetailsRouter.get("/listbymember/:id", asyncHandler(eventDetilsController.getEventDetailsById))
// eventDetailsRouter.post("/listbymember", asyncHandler(eventDetilsController.getEventDetailsById))
eventDetailsRouter.get("/complete/:memberId", asyncHandler(eventDetilsController.completedEvent))
eventDetailsRouter.get("/user-event/:memberId", asyncHandler(eventDetilsController.UserEvent))

module.exports = eventDetailsRouter