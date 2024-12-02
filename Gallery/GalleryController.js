const { S_W_W, I_S_E, Success } = require("../Constent")
const galleryModel = require("./GalleryModel")
const randString = require("randomstring")
const fs = require("fs")

class GalleryController {

    async uploadFile(req, res) {
        try {
            const file = req.files.file
            let fileName = randString.generate({ length: 8, charset: "alphabetic" })
            let ext = file.name.split(".")
            ext = ext[ext.length - 1]
            fileName += "."
            fileName += ext
            let filePath = "/public/" + fileName
            file.mv("." + filePath)
            const result = await galleryModel.model.create({ name: fileName, path: filePath })
            if (!result) return res.status(500).send({ message: S_W_W })
            return res.status(200).send({ message: Success, data:{url:process.env.APP_STATIC_URL + filePath}})
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: I_S_E })
        }
    }

    async ListGallery(req, res) {
        try {
            const result = await galleryModel.model.find({}, {
                name: true,
                _id: true,
                path: true,
                uri: { $concat: [process.env.APP_STATIC_URL, "$path"] }
            }).sort({"createdAt": -1})
            if (!result) return res.status(500).send({ message: S_W_W })
            return res.status(200).send({ message: Success, data: result })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: I_S_E })
        }
    }
    async DeleteGallery(req, res) {
        try {
            const { id } = req.params
            const find = await galleryModel.model.findOne({_id:id})
            if (!find) return res.status(500).send({ message: S_W_W })
            const result = await galleryModel.model.deleteOne({ _id: id })
            if (!result || result.deletedCount <= 0) return res.status(500).send({ message: S_W_W })
            const fileName = find.path
            if (!fileName) return res.status(500).send({ message: S_W_W })
            await GalleryController.unlinkPromise(fileName)
            return res.status(200).send({ message: Success })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: I_S_E })
        }
    }

   static unlinkPromise(file) {
        return new Promise((resolve, reject) => {
            fs.unlink("."+file, (error) => {
                if (error) {
                    reject(error);
                }
                resolve(true);
            })
        })
    }
}


const galleryController = new GalleryController()

module.exports = galleryController