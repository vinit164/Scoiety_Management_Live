const securityProtocolModel = require('../models/SecurityProtocolModel.js');
const { httpErrors, httpSuccess } = require("../constents.js");

class SecurityProtocolController {
  async createProtocols(req, res) {
    try {
      console.log(req.body)
      const { societyId, title, discription } = req.body;
      if (!societyId || !title || !discription) {
        return res.status(400).json({ message: "All fields are required (societyId, title, description)." });
      }

      const result = await securityProtocolModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).json({ message: "Failed to create security protocol. Please try again." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async getSecurityProtocols(req, res) {
    try {
      const { societyId } = req.params;

      if (!societyId) {
        return res.status(400).json({ message: "Society ID is required." });
      }

      const result = await securityProtocolModel.model.find({ societyId });
      if (!result || result.length === 0) {
        return res.status(405).json({ message: "No security protocols found for the given society." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }
  async getSecurityProtocolsById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Society ID is required." });
      }

      const result = await securityProtocolModel.model.find({ _id : id });
      if (!result || result.length === 0) {
        return res.status(405).json({ message: "No security protocols found for the given society." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async deleteProtocols(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Protocol ID is required." });
      }

      const result = await securityProtocolModel.model.deleteOne({ _id: id });

      if (!result || result.deletedCount < 1) {
        return res.status(405).json({ message: "Security protocol not found." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async updateSecurityProtocol(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Protocol ID is required." });
      }

      const result = await securityProtocolModel.model.updateOne({ _id: id }, { ...req.body });

      if (!result || result.modifiedCount < 1) {
        return res.status(400).json({ message: "Failed to update security protocol. Please try again." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }
}

const securityProtocolController = new SecurityProtocolController();
module.exports = securityProtocolController;
