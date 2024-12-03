const { Router } = require('express')
const asyncHandler = require('express-async-handler');
const maintenanceDetailsController = require('../controllers/MaintenanceDetailsController');

const maintenanceDetailsRouter = Router()

maintenanceDetailsRouter.get("/member/:societyId", asyncHandler(maintenanceDetailsController.getUserMaintenanceDetails))

maintenanceDetailsRouter.put("/member/update", asyncHandler(maintenanceDetailsController.updateMaintenanceDetails))

maintenanceDetailsRouter.get("/pending/:memberId", asyncHandler(maintenanceDetailsController.pendingMaintenance))

maintenanceDetailsRouter.get("/due/:memberId", asyncHandler(maintenanceDetailsController.dueMaintenance))

maintenanceDetailsRouter.get("/complete/:memberId", asyncHandler(maintenanceDetailsController.completedMaintenance))

maintenanceDetailsRouter.get("/list/:id", asyncHandler(maintenanceDetailsController.getMaintenanceDetailsByMember))

maintenanceDetailsRouter.get("/maintain/:societyId", asyncHandler(maintenanceDetailsController.getTotalMaintenanceAmount))

maintenanceDetailsRouter.get("/penalty/:societyId", asyncHandler(maintenanceDetailsController.getTotalPenaltyAmount))

maintenanceDetailsRouter.get("/allpending/:societyId", asyncHandler(maintenanceDetailsController.allPendingMaintenance))

maintenanceDetailsRouter.get("/user-maintan/:memberId", asyncHandler(maintenanceDetailsController.UserMaintenance))

module.exports = maintenanceDetailsRouter