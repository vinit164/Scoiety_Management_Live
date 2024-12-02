const { default: mongoose } = require("mongoose");

class ComplaintModel {
  constructor() {
    this.schema = mongoose.Schema({
      memberId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_members" },
      societyId: { type: mongoose.Types.ObjectId, ref: "tbl_societies", required: true },
      complainerName: { type: String, required: true },
      complaintName: { type: String, required: true },
      discription: { type: String, required: true },
      wingId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_wings" },
      unitId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_units" },
      priorityStatus: { type: String, enum: ["High", "Medium", "Low"], default: "Low" },
      status: { type: String, enum: ["Open", "Pending", "Solve"], default: "Pending" },
      complaintype: { type: String, enum: ["Complain", "Request"], default: "Request" },
    }, { timestamps: true })
    this.model = mongoose.model("tbl_complaints", this.schema)
  }
}

const complaintModel = new ComplaintModel()
module.exports = complaintModel