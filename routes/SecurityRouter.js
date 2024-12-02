const express = require('express');
const { storage } = require('../cloudinaryConfig.js');
const multer = require('multer');
const upload = multer({ storage });
const asyncHandler = require('express-async-handler');
const securityController = require("../controllers/SecurityController.js")

const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'adharCardImage', maxCount: 1 },
]);

const securityRouter = express.Router();

securityRouter.post('/createsecurity', uploadFields, asyncHandler(securityController.createSecurity));
securityRouter.get('/getsecurity/:societyId', asyncHandler(securityController.getSecurity));
securityRouter.delete('/deletesecurity/:id', asyncHandler(securityController.deleteSecurity))
securityRouter.put('/updatesecurity/:id', uploadFields, asyncHandler(securityController.updateSecurity))

module.exports = securityRouter