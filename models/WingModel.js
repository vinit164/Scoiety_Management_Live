const { default: mongoose } = require("mongoose");

class WingModel {
    constructor() {
        this.schema = new mongoose.Schema({
            wingName: { type: String, required: true },
            societyId: { type: mongoose.Types.ObjectId, ref:"tbl_societies", required: true },
            
        }, { timestamps: true })
        this.model = mongoose.model("tbl_wings", this.schema)
    }
}

const wingModel = new WingModel()
 module.exports = wingModel