const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const userController = require("../controllers/UserController");
const authenticate = require('../middleware/Authanticationtoken')
const multer = require('multer');
const { storage } = require("../cloudinaryConfig");
const upload = multer({ storage })

const userRouter = Router()

userRouter.post("/auth", asyncHandler(userController.authenticationPermission))
userRouter.post("/login", asyncHandler(userController.loginUser))
userRouter.post("/forgot-password", asyncHandler(userController.forgotPassword))
userRouter.post("/verify-otp", asyncHandler(userController.verifyOtp))
userRouter.post("/reset-password", asyncHandler(userController.resetPassword))


userRouter.put("/edit-profile",authenticate , upload.single('file'), asyncHandler(userController.editProfile))

userRouter.get("/searchuser", asyncHandler(userController.searchUserByName))
userRouter.get("/userdetails",authenticate  ,asyncHandler(userController.UserDetails))

module.exports = userRouter