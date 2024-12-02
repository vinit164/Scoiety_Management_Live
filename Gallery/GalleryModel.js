const { default: mongoose } = require("mongoose");

class GalleryModel {
    constructor(){
        this.schema = new mongoose.Schema({
            name:{type:String, required:true},
            path:{type:String, required:true},
        }, {
            timestamps:true
        })
        this.model = mongoose.model("tbl_galleries", this.schema)
    }
}

const galleryModel = new GalleryModel()

module.exports =  galleryModel