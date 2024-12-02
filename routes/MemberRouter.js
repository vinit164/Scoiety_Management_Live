const express = require('express');
const memberController = require('../controllers/MemberController');
const { storage } = require('../cloudinaryConfig');
const multer = require('multer');
const upload = multer({ storage });
const asyncHandler = require('express-async-handler');

const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'aadharFront', maxCount: 1 },
  { name: 'aadharBack', maxCount: 1 },
  { name: 'veraBill', maxCount: 1 },
  { name: 'agreement', maxCount: 1 }
]);
const memberRouter = express.Router();

memberRouter.post('/createMember', uploadFields, asyncHandler(memberController.createMember));
memberRouter.get('/:societyId', asyncHandler(memberController.listMember));
memberRouter.get('/list/:memberId', asyncHandler(memberController.getMemberById));
memberRouter.get('/listbywing/:wingId', asyncHandler(memberController.listMemberByWing));
memberRouter.get('/listbyunit/:unitId', asyncHandler(memberController.listMemberByUnit));
memberRouter.put('/update',uploadFields, asyncHandler(memberController.updateMember));

module.exports = memberRouter;
