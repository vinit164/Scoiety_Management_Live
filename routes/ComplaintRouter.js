const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const complaintController = require("../controllers/ComplaintController");

const complaintRouter = Router()

complaintRouter.post("/create", asyncHandler(complaintController.createComplaint))
complaintRouter.post("/list", asyncHandler(complaintController.listAllComplain))
complaintRouter.put("/update/:id", asyncHandler(complaintController.updateComplaint))
complaintRouter.delete("/delete/:id", asyncHandler(complaintController.deleteComplain))
complaintRouter.get("/listComplain/:societyId", asyncHandler(complaintController.listComplain))
complaintRouter.get("/listRequest/:societyId", asyncHandler(complaintController.listRequest))
complaintRouter.get("/listById/:memberId", asyncHandler(complaintController.getComplainById))

module.exports = complaintRouter