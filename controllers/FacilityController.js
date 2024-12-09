const { httpSuccess, httpErrors } = require('../constents');
const facilityModel = require('../models/FacilityModel');

class FacilityController {
  async createfacility(req, res) {
    try {
      const { societyId, facilityName, description, serviceDate, remindBefore } = req.body;

      if (!societyId || !facilityName || !description || !serviceDate || !remindBefore) {
        return res.status(400).send({ message: 'Bad Request: Missing required fields' });
      }

      const result = await facilityModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to create facility' });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async getfacility(req, res) {
    try {
      const { societyId } = req.params;

      if (!societyId) {
        return res.status(400).send({ message: 'Bad Request: Society ID is required' });
      }

      const result = await facilityModel.model.find({ societyId: societyId });
      if (!result || result.length === 0) {
        return res.status(405).send({ message: 'No facilities found for the given society' });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async updatefacility(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ message: 'Bad Request: Facility ID is required' });
      }

      const result = await facilityModel.model.updateOne({ _id: id }, { ...req.body });
      if (!result || result.modifiedCount === 0) {
        return res.status(405).send({ message: 'Facility not found or no changes made' });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

const facilitycontroller = new FacilityController();

module.exports = facilitycontroller;
