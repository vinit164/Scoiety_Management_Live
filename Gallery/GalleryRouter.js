const express =require("express")
const fileUpload = require("express-fileupload")
const galleryController = require("./GalleryController")
const GalleryRouter = express.Router()

GalleryRouter.use(fileUpload())

GalleryRouter.post("/upload", galleryController.uploadFile)
GalleryRouter.get("/list", galleryController.ListGallery)
GalleryRouter.delete("/delete/:id", galleryController.DeleteGallery)

module.exports = GalleryRouter