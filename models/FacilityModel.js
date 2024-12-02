const { default: mongoose } = require("mongoose");

class FacilityModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
      facilityName: { type: String, required: true },
      description: { type: String, required: true },
      serviceDate: { type: String, required: true },
      remindBefore: { type: String, required: true },
    })
    this.model = mongoose.model("tbl_facilities", this.schema)
  }
}
const facilityModel = new FacilityModel()
module.exports = facilityModel