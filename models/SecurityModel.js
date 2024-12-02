const mongoose = require("mongoose");
class SecurityModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
        userId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_users" },
        gender: { type: String, required: true },
        shift: { type: String, required: true },
        joiningDate: { type: String, required: true },
        shiftTime: { type: String, required: true },
        profileImage: { type: String, required: true },
        adharCardImage: { type: String, required: true },
      },
      { timeseries: true }
    );

    this.model = mongoose.model("tbl_Securities", this.schema);
  }
}

const securityModel = new SecurityModel();
module.exports = securityModel;
