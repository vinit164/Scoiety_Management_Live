const { default: mongoose } = require("mongoose");

class EventDetilsModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_Securities" },
      eventId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_events" },
      memberId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_members" },
      amount: { type: Number, required: true },
      paymentStatus: { type: String, enum: ["Pending", "Done"], default: "Pending" },
      paymentMethod: { type: String, enum: ["Cash", "Online", "Pending"], default: "Pending" },
      paymentDate: { type: Date, required: true },
    }, {
      timestamps: true
    })
    this.model = mongoose.model("tbl_eventdetails", this.schema)
  }
}


const eventDetilsModel = new EventDetilsModel()

module.exports = eventDetilsModel