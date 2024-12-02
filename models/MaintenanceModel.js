const { default: mongoose } = require("mongoose");

class MaintenanceModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_Securities" },
      maintenanceAmount: { type: Number, required: true },
      penaltyAmount: { type: Number, required: true, default: 0 },
      dueDate: { type: Date, default: Date.now },
      dueDays: { type: Number, required: true }
    }, {
      timestamps: true
    })
    this.model = mongoose.model("tbl_maintenances", this.schema)
  }
}

const maintenanceModel = new MaintenanceModel()

module.exports = maintenanceModel