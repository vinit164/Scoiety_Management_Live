const { httpErrors, httpSuccess } = require("../constents");
const maintenanceDetailsModel = require("../models/MaintenanceDetailsModel");
const memberModel = require("../models/MemberModel");
const maintenanceModel = require("../models/MaintenanceModel");

class MaintenanceController {
  async createMaintenance(req, res) {
    try {
      let { maintenanceAmount, penaltyAmount, dueDate, dueDays, societyId } = req.body;
      if (!maintenanceAmount || !penaltyAmount || !dueDate || !dueDays || !societyId) {
        return res.status(400).send({ message: 'Bad Request: Missing required fields' });
      }
      dueDate = new Date(dueDate);
      dueDays = Number(dueDays);
      const result = await maintenanceModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to create maintenance record' });
      }

      const penaltyDate = result.dueDate;
      penaltyDate.setDate(penaltyDate.getDate() + result.dueDays);

      const societyMembers = await memberModel.model.find({ societyId: societyId });
      if (!societyMembers || societyMembers.length === 0) {
        return res.status(405).send({ message: 'No members found for the given society' });
      }

      await Promise.all(
        societyMembers.map(async (data) => {
          const maintenanceDetails = await maintenanceDetailsModel.model.create({
            societyId,
            maintenanceId: result._id,
            memberId: data._id,
            amount: maintenanceAmount,
            paymentDate: result.dueDate
          });
          if (!maintenanceDetails) {
            throw new Error(`Failed to create maintenance details for member ID: ${data._id}`);
          }
          await maintenanceDetailsModel.schedulePenaltyJob(maintenanceDetails._id, penaltyDate, penaltyAmount);
        })
      );

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      if (error.message.includes('Failed to create maintenance details')) {
        return res.status(500).send({ message: error.message });
      }
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async maintenanceAmount(req, res) {
    try {
      const result = await maintenanceModel.model.find();
      if (!result || result.length === 0) {
        return res.status(405).send({ message: 'No maintenance records found' });
      }

      let MaintenanceAmount = 0;
      for (let i = 0; i < result.length; i++) {
        MaintenanceAmount += result[i].maintenanceAmount;
      }
      return res.status(200).send({ message: httpSuccess, data: MaintenanceAmount });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async penaltyAmount(req, res) {
    try {
      const result = await maintenanceModel.model.find();
      if (!result || result.length === 0) {
        return res.status(405).send({ message: 'No maintenance records found' });
      }

      let PenaltyAmount = 0;
      for (let i = 0; i < result.length; i++) {
        PenaltyAmount += result[i].penaltyAmount;
      }
      return res.status(200).send({ message: httpSuccess, data: PenaltyAmount });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

const maintenanceController = new MaintenanceController();
module.exports = maintenanceController;
