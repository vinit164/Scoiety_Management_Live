const { default: mongoose } = require("mongoose");

class MaintenanceDetailsModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_Securities" },
      maintenanceId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_maintenances" },
      memberId: { type: mongoose.Types.ObjectId, required: true, ref: "tbl_members" },
      amount: { type: Number, required: true },
      penaltyAmount: { type: Number, default: 0 },
      paymentStatus: { type: String, enum: ["Pending", "Done"], default: "Pending" },
      paymentMethod: { type: String, enum: ["Cash", "Online", "Pending"], default: "Pending" },
      paymentDate: { type: Date, required: true },
    }, { timestamps: true })

    this.model = mongoose.model("tbl_maintenanceDetails", this.schema)
  }



  async schedulePenaltyJob(id, penaltyDate, penaltyAmount) {
    const cron = require('node-cron');
    // Calculate the cron schedule (in this example, it's just the exact date)
    const cronSchedule = `${penaltyDate.getMinutes()} ${penaltyDate.getHours()} ${penaltyDate.getDate()} ${penaltyDate.getMonth() + 1} *`;
    const data = await this.model.findOne({ _id: id })
    cron.schedule(cronSchedule, async () => {
      if (data.paymentStatus === "Pending") {
        await this.model.updateOne(
          { _id: id },
          { $inc: { penaltyAmount: penaltyAmount } }  // Increment penalty amount by 1 or adjust as necessary
        );
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"  // Set your timezone
    });
  }

}

const maintenanceDetailsModel = new MaintenanceDetailsModel
module.exports = maintenanceDetailsModel