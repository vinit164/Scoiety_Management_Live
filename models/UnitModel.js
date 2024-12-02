const { default: mongoose } = require("mongoose");

class UnitModel {
    constructor() {
        this.schema = new mongoose.Schema({
            unitNumber: { type: Number, required: true },
            wingId: { type: mongoose.Types.ObjectId, ref:"tbl_wings", required: true },
            societyId: { type: mongoose.Types.ObjectId, ref:"tbl_societies", required: true },
        }, { timestamps: true })
        this.model = mongoose.model("tbl_units", this.schema)
    }
}

const unitModel = new UnitModel()
 module.exports = unitModel