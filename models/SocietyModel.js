const { default: mongoose } = require("mongoose");
const wingModel = require("./WingModel");
const unitModel = require("./UnitModel");

class SocietyModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        societyName: { type: String, required: true },
        societyAddress: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        societyType: { type: String, enum: ["tenement", "apartment"], required: true },
        wingCount: { type: Number, required: true, default: 1 },
        zipCode: { type: String, length: 6, required: true },
      },
      { timestamps: true }
    );
    this.model = mongoose.model("tbl_societies", this.schema);

    this.schema.pre("remove", async (next) => {
      try {
        await wingModel.deleteMany({ societyId: this._id });

        await unitModel.deleteMany({ societyId: this._id });
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}

const societyModel = new SocietyModel();
module.exports = societyModel;
