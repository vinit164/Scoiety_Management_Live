const { httpErrors, httpSuccess } = require("../constents");
const expanseNoteModel = require("../models/ExpanseNoteModel");

class ExpanseNoteController {
  async createNote(req, res) {
    try {
      const { societyId, title, description, date } = req.body;
      if (!societyId || !title || !description || !date) {
        return res.status(400).send({ message: 'Bad Request: Missing required fields' });
      }
      const result = await expanseNoteModel.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: 'Internal Server Error: Failed to create the note' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async listNote(req, res) {
    try {
      const { societyId } = req.params;
      if (!societyId) {
        return res.status(400).send({ message: 'Bad Request: Society ID is required' });
      }
      const result = await expanseNoteModel.model.find({ societyId });
      if (!result || result.length === 0) {
        return res.status(405).send({ message: 'No notes found for the given society' });
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
        return res.status(400).send({ message: 'Bad Request: ID is required' });
      }
      const result = await expanseNoteModel.model.findOne({ _id: id });
      if (!result) {
        return res.status(405).send({ message: 'Note not found' });
      }
      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: 'Bad Request: ID is required' });
      }
      const result = await expanseNoteModel.model.updateOne({ _id: id }, { ...req.body });
      if (!result || result.modifiedCount === 0) {
        return res.status(405).send({ message: 'Note not found or no changes made' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: 'Bad Request: ID is required' });
      }
      const result = await expanseNoteModel.model.deleteOne({ _id: id });
      if (!result || result.deletedCount === 0) {
        return res.status(405).send({ message: 'Note not found or already deleted' });
      }
      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error); 
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

const expanseNoteController = new ExpanseNoteController();
module.exports = expanseNoteController;
