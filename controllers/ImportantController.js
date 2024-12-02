const importantModal = require('../models/ImportantModal');
const { httpErrors, httpSuccess } = require('../constents');

class ImportantController {
  // Create Worker Number
  async createWorkerNumber(req, res) {
    try {

      const { fullName, phoneNumber, work } = req.body;

      // Validate required fields
      if (!fullName || !phoneNumber || !work) {
        return res.status(400).send({ message: 'Full name, phone number, and work type are required.' });
      }

      // Create new worker entry
      const result = await importantModal.model.create({ ...req.body });
      if (!result) {
        return res.status(500).send({ message: 'Error creating the worker number.' });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error processing the request.', error: error.message });
    }
  }

  // Get all Worker Details
  async getWorkerDetails(req, res) {
    try {

      // Fetch all worker details
      const result = await importantModal.model.find();
      if (!result || result.length === 0) {
        return res.status(404).send({ message: 'No worker details found.' });
      }

      return res.status(200).send({ message: httpSuccess, data: result });

    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error retrieving worker details.', error: error.message });
    }
  }

  // Delete Worker Details by ID
  async deleteWorkerDetails(req, res) {
    try {
      const { id } = req.params;

      // Validate the worker ID
      if (!id) {
        return res.status(400).send({ message: 'Worker ID is required.' });
      }

      // Delete the worker record
      const result = await importantModal.model.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'Worker not found or already deleted.' });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error deleting worker details.', error: error.message });
    }
  }

  // Update Important Worker Number by ID
  async updateImportantNumber(req, res) {
    try {
      const { id } = req.params;

      // Validate required fields
      if (!id) {
        return res.status(400).send({ message: 'Worker ID is required.' });
      }

      // Update the worker record
      const result = await importantModal.model.updateOne({ _id: id }, { ...req.body });

      // Check if the update was successful
      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: 'Worker not found or no changes made.' });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Error updating worker details.', error: error.message });
    }
  }
}

const importantController = new ImportantController();

module.exports = importantController;
