const { httpErrors, httpSuccess } = require('../constents');
const visitorModel = require('../models/VisitorModel');

class VisitorController {
  async createvisitor(req, res) {
    try {
      const { visitorName, phoneNumber , time, societyId, wingId, unitId, date, securityId } = req.body;
      console.log(req.body);

      if (!visitorName || !phoneNumber || !time || !societyId || !unitId || !date || !securityId || !wingId) {
        return res.status(400).json({ message: 'Missing required fields. Please provide all required information.' });
      }

      const result = await visitorModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).json({ message: 'Failed to create visitor. Try again later.' });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async getvisitor(req, res) {
    try {
      const { societyId } = req.params;

      if (!societyId) {
        return res.status(400).json({ message: 'Society ID is required.' });
      }

      const result = await visitorModel.model.find({ societyId }).populate([ { path: 'unitId' }, { path: 'securityId' }, { path: 'wingId' }, ]);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No visitors found for the given society.' });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async createEmergencyAnnouncement(req, res) {
    try {
      const { societyId, securityId, alertType, description } = req.body;

      if (!societyId || !securityId || !alertType || !description) {
        return res.status(400).json({ message: 'Missing required fields for emergency announcement.' });
      }

      const result = await visitorModel.emergencymodel.create({ ...req.body });
      if (!result) {
        return res.status(500).json({ message: 'Failed to create emergency announcement.' });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }

  async getEmergencyAnnouncement(req, res) {
    try {
      const result = await visitorModel.emergencymodel.find().populate([
        { path: 'societyId' },
        { path: 'securityId' },
      ]);
      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No emergency announcements found.' });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

const visitorController = new VisitorController();

module.exports = visitorController;
