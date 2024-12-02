const randomstring = require('randomstring')

module.exports = {
  baseURL: "http://localhost:5000",

  // DB_URL : "mongodb://127.0.0.1:27017/societymanagement",
  httpSuccess: "Success",
  httpErrors: {
    500: (() => {
      const err = new Error("Somthing went wrong")
      err.status = 500
      return err
    })(),
    400: (() => {
      const err = new Error("Missing dependency")
      err.status = 400
      return err
    })(),
    401: (() => {
      const err = new Error("unAuthorized")
      err.status = 401
      return err
    })()
  },
  uploadMedia: (file) => {
    let fileName = randomstring.generate({ length: 8, charset: "alphabetic" })
    let ext = file.name.split(".")
    ext = ext[ext.length - 1]
    fileName += "."
    fileName += ext
    let filePath = "/public/" + fileName
    file.mv("." + filePath)
    return filePath
  },
  extractPublicId: (imagePath) => {
    const parts = imagePath.split('/');
    const publicIdWithExtension = parts.slice(-2).join('/'); // Combine folder and public ID parts
    const publicId = publicIdWithExtension.split('.')[0]; // Remove file extension
    return publicId;
  }
}