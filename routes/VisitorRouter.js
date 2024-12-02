const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const visitorController = require("../controllers/VisitorController");
const visitorRouter = Router()

visitorRouter.post('/createvisitor', asyncHandler(visitorController.createvisitor))
visitorRouter.post('/createemergency', asyncHandler(visitorController.createEmergencyAnnouncement))
visitorRouter.get('/getvisitor/:societyId', asyncHandler(visitorController.getvisitor))
visitorRouter.get('/getemergency', asyncHandler(visitorController.getEmergencyAnnouncement))


module.exports = visitorRouter