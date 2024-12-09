
const { httpErrors, httpSuccess } = require("../constents");
const eventDetilsModel = require("../models/EventDetailsModel");
const eventModel = require("../models/EventModel")
const memberModel = require("../models/MemberModel")


class EventController {
  async createEvent(req, res) {
    try {
      const { societyId, title, date, dueDate, amount, description } = req.body;
      if (!societyId || !title || !date || !dueDate || !amount || !description) {
        return res.status(400).send({ message: "Missing required fields" });
      }
      const result = await eventModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: "Failed to create event" });
      }

      const societyMembers = await memberModel.model.find({ societyId: societyId });
      await Promise.all(
        societyMembers.map(async (data) => {
          const eventDetails = await eventDetilsModel.model.create({
            societyId,
            eventId: result._id,
            memberId: data._id,
            amount: amount,
            paymentDate: dueDate
          });
          if (!eventDetails) {
            throw new Error(`Failed to create event details for member ID: ${data._id}`);
          }
        })
      );
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async listEvent(req, res) {
    try {
      const { societyId } = req.params;
      const events = await eventModel.model.find({ societyId: societyId });
      if (!events || events.length === 0) {
        return res.status(405).send({ message: "No events found" });
      }

      let MemberCount = await memberModel.model.countDocuments({ societyId: societyId });
      const result = events.map(event => ({
        ...event._doc,
        MemberCount
      }));

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async getEventById(req, res) {
    try {
      const { eventId } = req.params;
      const result = await eventModel.model.findById(eventId);
      if (!result) {
        return res.status(405).send({ message: "Event not found" });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async updateEvent(req, res) {
    try {
      const { eventId, societyId, title, date, dueDate, amount, description } = req.body;
      if (!eventId || !societyId || !title || !date || !dueDate || !amount || !description) {
        return res.status(400).send({ message: "Missing required fields" });
      }

      const result = await eventModel.model.updateOne(
        { _id: eventId },
        { societyId, title, date, dueDate, amount, description }
      );
      if (!result || result.modifiedCount <= 0) {
        return res.status(500).send({ message: "Failed to update event" });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async deleteEvent(req, res) {
    try {
      console.log(req.params)
      const { eventId } = req.params;
      const result = await eventModel.model.deleteOne({ _id: eventId });
      console.log(result)
      if (!result || result.deletedCount <= 0) {
        return res.status(500).send({ message: "Failed to delete event" });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
}

const eventController = new EventController();
module.exports = eventController;
