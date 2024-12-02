const { default: mongoose } = require("mongoose");

class AnnouncementModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_societies" },
      announcementTitle: { type: String, required: true },
      announcementDescription: { type: String, required: true },
      announcementDate: { type: Date, required: true },
      announcementTime: { type: String, required: true },
    })
    this.model = mongoose.model("tbl_announcements", this.schema)
  }
}
const announcementModel = new AnnouncementModel()
module.exports = announcementModel