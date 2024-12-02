const { httpErrors, httpSuccess } = require("../constents");
const announcementModel = require("../models/AnnouncementModel");

class AnnouncementController {
  async createAnnouncement(req, res) {
    try {
    const { societyId, announcementTitle, announcementDescription, announcementDate, announcementTime } = req.body;
      if (!societyId || !announcementTitle || !announcementDescription || !announcementDate || !announcementTime) {
        return res.status(400).send({ message: 'Bad Request: Missing required fields' });
      }
      const result = await announcementModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to create announcement' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async listAnnouncement(req, res) {
    try {
      const { societyId } = req.params;
      if (!societyId) {
        return res.status(400).send({ message: 'Bad Request: Missing societyId' });
      }
      const result = await announcementModel.model.find({ societyId: societyId });
      if (!result || result.length === 0) {
        return res.status(404).send({ message: 'No announcements found for the given society' });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async listById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: 'Bad Request: Missing announcement ID' });
      }
      const result = await announcementModel.model.findOne({ _id: id });
      if (!result) {
        return res.status(404).send({ message: 'Announcement not found' });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: 'Bad Request: Missing announcement ID' });
      }
      const result = await announcementModel.model.updateOne({ _id: id }, { ...req.body });
      if (!result || result.modifiedCount === 0) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to update announcement' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: 'Bad Request: Missing announcement ID' });
      }
      const result = await announcementModel.model.deleteOne({ _id: id });
      if (!result || result.deletedCount === 0) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to delete announcement' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

const announcementController = new AnnouncementController();
module.exports = announcementController;
