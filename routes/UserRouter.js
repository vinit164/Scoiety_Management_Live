const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const userController = require("../controllers/UserController");
const multer = require('multer');
const { storage } = require("../cloudinaryConfig");
const authanticate = require("../Middleware/Authantication");
const upload = multer({ storage })

const userRouter = Router()

userRouter.post("/auth", asyncHandler(userController.authenticationPermission))
userRouter.post("/login", asyncHandler(userController.loginUser))
userRouter.post("/forgot-password", asyncHandler(userController.forgotPassword))
userRouter.post("/verify-otp", asyncHandler(userController.verifyOtp))
userRouter.post("/reset-password", asyncHandler(userController.resetPassword))


userRouter.put("/edit-profile",authanticate , upload.single('file'), asyncHandler(userController.editProfile))

userRouter.get("/searchuser", asyncHandler(userController.searchUserByName))
userRouter.get("/userdetails",authanticate  ,asyncHandler(userController.UserDetails))

module.exports = userRouter