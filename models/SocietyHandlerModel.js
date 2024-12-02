const { default: mongoose } = require("mongoose"); class SocietyHandlerModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        userId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_users" },
        selectSociety: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, length: 6, required: true },
      },
      { timestamps: true }
    );

    this.model = mongoose.model("tbl_society_managers", this.schema);
  }
}

const societyHandlerModel = new SocietyHandlerModel();

module.exports = societyHandlerModel;
