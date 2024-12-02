const { httpErrors, httpSuccess } = require('../constents')
const unitModel = require('../models/UnitModel')
const wingModel = require('../models/WingModel')
const societyModel = require('../models/SocietyModel')

class SocietyController {
  async createSociety(req, res) {
    try {
      const { societyName, societyAddress, country, state, city, zipCode, societyType, wingCount } = req.body;
      
      // Validate required fields
      if (!societyName || !societyAddress || !country || !state || !city || !zipCode || !societyType) {
        return res.status(400).send({ message: "All required fields must be provided." });
      }
      
      // Create society
      const result = await societyModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: "Error creating society." });
      }

      for (let i = 0; i < wingCount; i++) {
        let letter = String.fromCharCode(65 + i);
        await wingModel.model.create({ wingName: letter, societyId: result._id });
      }
      
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error creating society. Please try again later." });
    }
  }

  async listSociety(req, res) {
    try {
      const result = await societyModel.model.find();
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No societies found." });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error fetching societies. Please try again later." });
    }
  }

  async getSocietyById(req, res) {
    try {
      const { id } = req.params;
      const result = await societyModel.model.findOne({ _id: id });
      if (!result) {
        return res.status(404).send({ message: "Society not found." });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error fetching society by ID. Please try again later." });
    }
  }

  async deleteSocietyById(req, res) {
    try {
      const { id } = req.params;
      
      // Check if society exists
      const society = await societyModel.model.findById(id);
      if (!society) {
        return res.status(404).send({ message: "Society not found." });
      }

      // Delete related wings and units
      await wingModel.model.deleteMany({ societyId: id });
      await unitModel.model.deleteMany({ societyId: id });
      
      // Delete society
      await societyModel.model.findByIdAndDelete(id);
      return res.status(200).send({ message: "Society and related data deleted successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error deleting society. Please try again later." });
    }
  }
}

const societyController = new SocietyController();
module.exports = societyController;
