const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const facilitycontroller = require('../controllers/FacilityController')

const facilityRouter = Router()

facilityRouter.post('/addfacility', asyncHandler(facilitycontroller.createfacility))
facilityRouter.get('/getfacility/:societyId', asyncHandler(facilitycontroller.getfacility))
facilityRouter.put('/updatefacility/:id', asyncHandler(facilitycontroller.updatefacility))

module.exports = facilityRouter
