const { default: mongoose } = require("mongoose");

class ExpanseModel {
  constructor() {
    this.schema = new mongoose.Schema({
      title: { type: String, required: true },
      discription: { type: String, required: true },
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      billDocument: { type: String, required: true },
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
    }, { timestamps: true })
    this.model = mongoose.model("tbl_expanses", this.schema)
  }
}

const expanseModel = new ExpanseModel()
module.exports = expanseModel