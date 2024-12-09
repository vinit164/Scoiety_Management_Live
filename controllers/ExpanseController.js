const { httpErrors, httpSuccess } = require("../constents");
const expanseModel = require("../models/ExpanseModel");

class ExpanseController {
  async createExpanses(req, res) {
    try {
      const { societyId, title, amount, date, discription } = req.body;
      const file = req.file;

      if (!societyId || !title || !amount || !date || !discription || !file) {
        return res.status(400).send({ message: "Missing required fields or file" });
      }

      const result = await expanseModel.model.create({...req.body, billDocument: file.path });

      if (!result) {
        return res.status(500).send({ message: "Failed to create expense" });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async listExpanses(req, res) {
    try {
      const { societyId } = req.params;
      const result = await expanseModel.model.find({ societyId });

      if (!result || result.length === 0) {
        return res.status(405).send({ message: "No expenses found" });
      }
      let TotalExpanse = 0;
      for (let i = 0; i < result.length; i++) {
        TotalExpanse += result[i].amount;
      }

      return res.status(200).send({ message: "httpSuccess", data: { data: result, TotalExpanse} });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async listById(req, res) {
    try {
      const { expanseId } = req.params;

      if (!expanseId) {
        return res.status(400).send({ message: "Expense ID is required" });
      }

      const result = await expanseModel.model.findOne({ _id: expanseId });

      if (!result) {
        return res.status(405).send({ message: "Expense not found" });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async deleteExpanse(req, res) {
    try {
      const { expanseId } = req.params;

      if (!expanseId) {
        return res.status(400).send({ message: "Expense ID is required" });
      }

      const result = await expanseModel.model.deleteOne({ _id: expanseId });

      if (!result || result.deletedCount <= 0) {
        return res.status(500).send({ message: "Failed to delete expense" });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  async updateExpanse(req, res) {
    try {
      const { expanseId } = req.params;
      const { societyId, title, amount, date, discription } = req.body;
      const file = req.file;

      if (!expanseId) {
        return res.status(400).send({ message: "Expense ID is required" });
      }

      if (file && file.path) {
        req.body.billDocument = file.path;
      }

      const result = await expanseModel.model.updateOne( { _id: expanseId }, { ...req.body });

      if (!result || result.modifiedCount <= 0) {
        return res.status(500).send({ message: "Failed to update expense" });
      }

      return res.status(200).send({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
  async totalExpanse(req, res) {
    try {
      const result = await expanseModel.model.find();
      if (!result || result.length === 0) {
        return res.status(405).send({ message: 'No maintenance records found' });
      }

      let TotalExpanse = 0;
      for (let i = 0; i < result.length; i++) {
        TotalExpanse += result[i].amount;
      }
      return res.status(200).send({ message: httpSuccess, data: TotalExpanse });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
  }
}

const expanseController = new ExpanseController();
module.exports = expanseController;
