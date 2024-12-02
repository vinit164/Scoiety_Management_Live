const { httpErrors, httpSuccess } = require("../constents")
const wingModel = require("../models/WingModel")

class WingController {
  async createWing(req, res) {
    try {
      const { wingName, societyId } = req.body

      // Validate required fields
      if (!wingName || !societyId) {
        return res.status(400).send({ message: "Both wingName and societyId are required." })
      }

      // Create new wing
      const result = await wingModel.model.create({ ...req.body })
      if (!result) {
        return res.status(500).send({ message: "Failed to create wing. Please try again later." })
      }

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error creating wing. Please try again later.", error: error.message })
    }
  }

  async listWing(req, res) {
    try {
      const { societyId } = req.params

      // Validate societyId
      if (!societyId) {
        return res.status(400).send({ message: "Society ID is required to fetch wings." })
      }

      // Fetch wings associated with societyId
      const result = await wingModel.model.find({ societyId: societyId })
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No wings found for this society." })
      }

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error fetching wings. Please try again later.", error: error.message })
    }
  }

  async getWingById(req, res) {
    try {
      const { id } = req.params

      // Validate wingId
      if (!id) {
        return res.status(400).send({ message: "Wing ID is required." })
      }

      // Fetch wing by ID
      const result = await wingModel.model.findOne({ _id: id })
      if (!result) {
        return res.status(404).send({ message: "Wing not found." })
      }

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error fetching wing by ID. Please try again later.", error: error.message })
    }
  }

  async deleteWingById(req, res) {
    try {
      const { id } = req.params

      // Validate wingId
      if (!id) {
        return res.status(400).send({ message: "Wing ID is required to delete." })
      }

      // Delete wing by ID
      const result = await wingModel.model.deleteOne({ _id: id })
      if (!result || result.deletedCount <= 0) {
        return res.status(404).send({ message: "Wing not found or already deleted." })
      }

      return res.status(200).send({ message: "Wing deleted successfully." })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error deleting wing. Please try again later.", error: error.message })
    }
  }
}

const wingController = new WingController()
module.exports = wingController
