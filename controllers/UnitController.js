const { httpErrors, httpSuccess } = require("../constents")
const societyModel = require("../models/SocietyModel")
const wingModel = require("../models/WingModel")
const unitModel = require("../models/UnitModel")

class UnitController {
  async createUnit(req, res) {
    try {
      console.log(req.body)
      let { unitCount, series, societyId, floor } = req.body

      if (!unitCount || !societyId || !series || !floor) {
        return res.status(400).send({ message: "unitCount, societyId, series, and floor are required." })
      }
      if (floor === 0) {
        floor = 1
      }
      const societyData = await societyModel.model.findOne({ _id: societyId })
      if (!societyData) {
        return res.status(404).send({ message: "Society not found." })
      }

      // Fetch wings related to the society
      const wings = await wingModel.model.find({ societyId: societyId }).populate('societyId')
      if (!wings || wings.length === 0) {
        return res.status(404).send({ message: "No wings found for the specified society." })
      }

      let Block
      // Handle unit creation logic based on society type (tenement or other)
      if (societyData.societyType === "tenement") {
        // Loop through wings and create units
        for (let i = 0; i < wings.length; i++) {
          for (let j = 0; j < unitCount; j++) {

            Block = await unitModel.model.create({
              unitNumber: ((i + 1) * series) + j + 1,
              wingId: wings[i]._id,
              societyId: societyId
            })
            if (!Block) {
              return res.status(500).send({ message: "Failed to create unit." })
      }
          }
        }
      } else {
        // Loop through wings and floors to create units
        for (let i = 0; i < wings.length; i++) {
          for (let j = 0; j < floor; j++) {
            for (let k = 0; k < unitCount; k++) {
              Block = await unitModel.model.create({
                unitNumber: ((j + 1) * series) + k + 1,
                wingId: wings[i]._id,
                societyId: societyId
              })
              if (!Block) {
                return res.status(500).send({ message: "Failed to create unit." })
              }
            }
          }
        }
      }

      // Return success message if units are created successfully
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error creating unit. Please try again later.", error: error.message })
    }
  }

  async listUnit(req, res) {
    try {
      const { wingId } = req.params

      // Validate wingId
      if (!wingId) {
        return res.status(400).send({ message: "wingId is required." })
      }

      // Fetch units associated with the given wingId
      const result = await unitModel.model.find({ wingId: wingId }).populate({ path: "wingId" })
      if (!result || result.length === 0) {
        return res.status(404).send({ message: "No units found for the specified wing." })
      }

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error fetching units. Please try again later.", error: error.message })
    }
  }

  async getUnitById(req, res) {
    try {
      const { id } = req.params

      // Validate unitId
      if (!id) {
        return res.status(400).send({ message: "Unit ID is required." })
      }

      // Fetch unit by ID
      const result = await unitModel.model.findOne({ _id: id })
      if (!result) {
        return res.status(404).send({ message: "Unit not found." })
      }

      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error fetching unit by ID. Please try again later.", error: error.message })
    }
  }

  async deleteUnitById(req, res) {
    try {
      const { id } = req.params

      // Validate unitId
      if (!id) {
        return res.status(400).send({ message: "Unit ID is required to delete." })
      }

      // Delete unit by ID
      const result = await unitModel.model.deleteOne({ _id: id })
      if (!result || result.deletedCount <= 0) {
        return res.status(404).send({ message: "Unit not found or already deleted." })
      }

      return res.status(200).send({ message: "Unit deleted successfully." })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error deleting unit. Please try again later.", error: error.message })
    }
  }
  async TotalUnit(req, res) {
    try {
  
      const result = await unitModel.model.countDocuments()
    
      return res.status(200).send({ message: "Total numbers of unit", data: result });
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: "Error fetching total unit. Please try again later.", error: error.message })
    }
  }
}

const unitController = new UnitController()
module.exports = unitController
