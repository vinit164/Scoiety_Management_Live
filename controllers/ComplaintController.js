const { httpErrors, httpSuccess } = require("../constents");
const complaintModel = require("../models/ComplaintModel");

class ComplaintController {
  async createComplaint(req, res) {
    try {
      const { memberId, societyId ,complainerName, complaintName, discription, wingId, unitId, priorityStatus, complaintype } = req.body;
      if (!memberId || !societyId || !complainerName || !complaintName || !discription || !wingId || !unitId || !priorityStatus || !complaintype) {
        return res.status(400).json({ message: "Missing required fields. Please provide all the necessary information." });
      }

      const result = await complaintModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).json({ message: "Failed to create complaint. Try again later." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async updateComplaint(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      const result = await complaintModel.model.updateOne({ _id: id }, { ...req.body });
      if (!result || result.modifiedCount === 0) {
        return res.status(404).json({ message: "Complaint not found or no changes were made." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async deleteComplain(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Complaint ID is required." });
      }

      const result = await complaintModel.model.deleteOne({ _id: id });
      if (!result || result.deletedCount === 0) {
        return res.status(404).json({ message: "Complaint not found or already deleted." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async listAllComplain(req, res) {
    try {
      const { societyId, type } = req.body;
      if (!societyId || !type) {
        return res.status(400).json({ message: "Society ID and complaint type are required." });
      }

      const result = await complaintModel.model.find({ societyId, complaintype: type }).populate([{ path: "memberId", populate: { path: "userId" } },{ path: "wingId" },{ path: "unitId" }, ]);

      if (!result || result.length === 0) {
        return res.status(404).json({ message: "No complaints found for the given society and type." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async listComplain(req, res) {
    try {
      const { societyId } = req.params;
      if (!societyId) {
        return res.status(400).json({ message: "Society ID is required." });
      }

      const result = await complaintModel.model.find({ societyId, complaintype: "Complain" });
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "No complaints found for the given society." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async listRequest(req, res) {
    try {
      const { societyId } = req.params;
      if (!societyId) {
        return res.status(400).json({ message: "Society ID is required." });
      }

      const result = await complaintModel.model.find({ societyId, complaintype: "Request" });
      if (!result || result.length === 0) {
        return res.status(404).json({ message: "No requests found for the given society." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }

  async getComplainById(req, res) {
    try {
      const { memberId } = req.params;
      console.log(memberId);
      
      if (!memberId) {
        return res.status(400).json({ message: "Member ID is required." });
      }

      const result = await complaintModel.model.findOne({ memberId });
      if (!result) {
        return res.status(404).json({ message: "Complaint not found for the given member ID." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
}

const complaintController = new ComplaintController();
module.exports = complaintController;
