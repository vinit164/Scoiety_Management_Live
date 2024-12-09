const { httpSuccess, httpErrors } = require("../constents");
const eventDetailsModel = require("../models/EventDetailsModel");

class EventDetailsController {
  async listEventDetails(req, res) {
    try {
      const { societyId } = req.params;
      const result = await eventDetailsModel.model.find({ societyId: societyId });
      if (!result || result.length === 0) {
        return res.status(405).send({ message: "No event details found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async listDetailsByEvent(req, res) {
    try {
      const { eventId } = req.params;
      const result = await eventDetailsModel.model.find({ eventId: eventId });
      if (!result || result.length === 0) {
        return res.status(405).send({ message: "No details found for this event" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async completedEvent(req, res) {
    try {
      const { memberId } = req.params;
      const result = await eventDetailsModel.model.find({ memberId: memberId, paymentStatus: 'Done' })
        .populate([
          { path: "memberId", populate: { path: "userId" } },
          { path: "eventId" }
        ]);
      if (!result || result.length === 0) {
        return res.status(405).send({ message: "No completed events found for this member" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
  
  async UserEvent(req, res) {
    try {
      const { memberId } = req.params;
      const result = await eventDetailsModel.model.find({ memberId: memberId})
      if (!result || result.length === 0) {
        return res.status(405).send({ message: "No completed events found for this member" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getEventDetailsById(req, res) {
    try {
      const { id } = req.params;
      const result = await eventDetailsModel.model.findOne({ _id: id })
        .populate([
          { path: "memberId", populate: { path: "userId" } },
          { path: "eventId" }
        ]);
      if (!result) {
        return res.status(405).send({ message: "Event details not found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async updateEventDetails(req, res) {
    try {
      const { eventId, memberId, amount, paymentMethod, paymentDate, societyId } = req.body;
      if (!eventId || !memberId || !amount || !paymentMethod || !paymentDate || !societyId) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      const result = await eventDetailsModel.model.updateOne(
        { societyId: societyId, eventId: eventId, memberId: memberId },
        { paymentMethod, paymentStatus: "Done", paymentDate, amount }
      );

      if (!result || result.modifiedCount === 0) {
        return res.status(500).send({ message: "Failed to update event details" });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

const eventDetailsController = new EventDetailsController();

module.exports = eventDetailsController;
