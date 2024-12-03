const { httpErrors, httpSuccess } = require("../constents.js");
const maintenanceDetailsModel = require('../models/MaintenanceDetailsModel.js');

class MaintenanceDetailsController {
  async createMaintenanceDetails(req, res) {
    try {
      const { maintenanceId, memberId, amount, penaltyAmount, paymentStatus, paymentMethod, paymentDate, societyId } = req.body;
      if (!maintenanceId || !memberId || !amount || !penaltyAmount || !paymentStatus || !paymentMethod || !paymentDate || !societyId) {
        return res.status(400).send({ message: "Missing required fields" });
      }
      const result = await maintenanceDetailsModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: "Failed to create maintenance details" });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getUserMaintenanceDetails(req, res) {
    try {
      const { societyId } = req.params;
      const result = await maintenanceDetailsModel.model.find({ societyId: societyId }).populate([
        { path: "maintenanceId" },
        {
          path: "memberId", populate: [
            { path: "userId" },
            { path: "wing" },
            { path: "unit" },
          ]
        },
      ]);
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No maintenance details found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getMaintenanceDetailsByMember(req, res) {
    try {
      const { id } = req.params;
      const result = await maintenanceDetailsModel.model.findOne({ _id: id }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }]);
      if (!result) {
        return res.status(404).send({ message: "Maintenance details not found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async dueMaintenance(req, res) {
    try {
      const { memberId } = req.params;
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus: "Pending" }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }]);
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No due maintenance found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
  async allPendingMaintenance(req, res) {
    try {
      const { societyId } = req.params;
      const result = await maintenanceDetailsModel.model.find({societyId : societyId ,penaltyAmount: { $gt: 0 } }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }]);
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No due maintenance found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async pendingMaintenance(req, res) {
    try {
      const { memberId } = req.params;
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, penaltyAmount: { $gt: 0 } }).populate({ path: "memberId", populate: { path: "userId" } });
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No pending maintenance found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async completedMaintenance(req, res) {
    try {
      const { memberId } = req.params
      const result = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus: 'Done' }).populate([{ path: "memberId", populate: { path: "userId" } }, { path: "maintenanceId" }])
      if (!result) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  
  async getTotalMaintenanceAmount(req, res) {
    try {
      const { societyId } = req.params
      const result = await maintenanceDetailsModel.model.find({societyId : societyId});

      if (!result || result.length === 0) {
        return res.status(404).send({ message: 'No maintenance records found' });
      }

      let MaintenanceAmount = 0;

      for (let i = 0; i < result.length; i++) {
        MaintenanceAmount += result[i].amount;
      }

      return res.status(200).send({
        message: httpSuccess,
        data: MaintenanceAmount
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async getTotalPenaltyAmount(req, res) {
    try {
      const result = await maintenanceDetailsModel.model.find();

      if (!result || result.length === 0) {
        return res.status(404).send({ message: 'No maintenance records found' });
      }

      let totalPenaltyAmount = 0;

      for (let i = 0; i < result.length; i++) {
        totalPenaltyAmount += result[i].penaltyAmount; 
      }

      return res.status(200).send({
        message: httpSuccess,
        data: totalPenaltyAmount
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async UserMaintenance(req, res) {
    try {
      const {memberId} = req.params
      const maintenanceDetails = await maintenanceDetailsModel.model.find({memberId : memberId})
      const pendingMaintenance = await maintenanceDetailsModel.model.find({ memberId: memberId, penaltyAmount: { $gt: 0 } });
      const dueMaintenance = await maintenanceDetailsModel.model.find({ memberId: memberId, paymentStatus:"Pending"});

      const responseData = {
        maintenance : maintenanceDetails,
        pendingMaintenance : pendingMaintenance ,
        dueMaintenance : dueMaintenance 
      }
      return res.status(200).json({ message: "User details fetch successfully.", data : responseData });  
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }


  async updateMaintenanceDetails(req, res) {
    try {
      const { maintenanceId, memberId, amount, penaltyAmount, paymentMethod, paymentDate, societyId } = req.body;
      if (!maintenanceId || !memberId || !amount || !penaltyAmount || !paymentMethod || !paymentDate || !societyId) {
        return res.status(400).send({ message: "Missing required fields" });
      }
      const result = await maintenanceDetailsModel.model.updateOne({
        societyId: societyId,
        maintenanceId: maintenanceId,
        memberId: memberId
      }, {
        paymentMethod: paymentMethod,
        paymentStatus: "Done",
        paymentDate: paymentDate,
        amount: amount,
        penaltyAmount: penaltyAmount
      });
      if (!result || result.modifiedCount <= 0) {
        return res.status(500).send({ message: "Failed to update maintenance details" });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

const maintenanceDetailsController = new MaintenanceDetailsController();
module.exports = maintenanceDetailsController;
