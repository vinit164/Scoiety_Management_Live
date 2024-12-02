const { default: mongoose } = require("mongoose");

class EventModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
      title: { type: String, required: true },
      date: { type: Date, required: true },
      dueDate: { type: Date, required: true },
      amount: { type: Number, required: true },
      description: { type: String, required: true }
    }, {
      timestamps: true
    })
    this.model = mongoose.model("tbl_events", this.schema)
  }
}

const eventModel = new EventModel()
module.exports = eventModel