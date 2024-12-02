const { default: mongoose } = require("mongoose"); class MemberModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        residentStatus: { type: String, enum: ["Owner", "Tenant"], required: true },
        unitStatus: { type: String, enum: ["Occupied", "Vacate"], default: "Occupied" },
        userId: { type: mongoose.Types.ObjectId, ref: "tbl_users", required: true },
        societyId: { type: mongoose.Types.ObjectId, ref: "tbl_societies", required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true, enum: ["Male", "Female", "Others"] },
        wing: { type: mongoose.Types.ObjectId, ref: "tbl_wings", required: true },
        unit: { type: mongoose.Types.ObjectId, ref: "tbl_units", required: true, unique: true },
        profileImage: { type: String, required: true },
        aadharFront: { type: String, required: true },
        aadharBack: { type: String, required: true },
        veraBill: { type: String, required: true },
        agreement: { type: String, required: true },
        familyMember: [
          {
            fullName: { type: String, required: true },
            phoneNumber: { type: Number, required: true },
            email: { type: String, default: null },
            gender: { type: String, required: true, enum: ["Male", "Female", "Others"] },
            age: { type: Number, required: true },
            relation: { type: String, required: true },
          },
        ],
        vehicle: [
          {
            vehicleName: { type: String, required: true },
            vehicleNumber: { type: String, required: true, unique: true },
            vehicleType: { type: String, required: true, enum: ["Two_Wheeler", "Four_Wheeler", "Others"] },
          },
        ],
        // Tenant requirement
        OwnerInfo: {
          fullName: { type: String },
          phoneNumber: { type: Number },
          address: { type: String },
        },
      },
      {
        timestamps: true,
      }
    );
    this.model = mongoose.model("tbl_members", this.schema);
  }
}

const memberModel = new MemberModel();
module.exports = memberModel;
