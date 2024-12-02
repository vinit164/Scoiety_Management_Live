const { default: mongoose } = require("mongoose");
class UserModel {
  constructor() {
    this.schema = new mongoose.Schema(
      {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phoneNumber: { type: Number, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["Member", "Chairman", "Security"], required: true }, 
        otpExpires: { type: Date }  
      },
      { timestamps: true }
    );
    this.model = mongoose.model("tbl_users", this.schema);
  }
}

const userModel = new UserModel();
module.exports = userModel;
