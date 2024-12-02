const { httpErrors, httpSuccess } = require('../constents')
const userModel = require('../models/UserModel')
const societyHandlerModel = require('../models/SocietyHandlerModel')
const bcrypt = require("bcrypt")

class SocietyHandlerController {

  async createChairman(req, res) {
    try {
      const { firstName, lastName, email, phoneNumber, password, confirmPassword, selectSociety, country, state, city, zipCode } = req.body
      if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword || !selectSociety || !country || !state || !city || !zipCode) {
        return res.status(400).json({ message: "Missing required fiels, Please provide it all fields" })
      }

      if (password !== confirmPassword) return res.status(400).json({ message: "Password do not match" })
      const encryptedPass = bcrypt.hashSync(password, 5)
      if (!encryptedPass) return res.status(500).json({ message: "Password encrypt failed." })

      //user already exist
      const existingUser = await userModel.model.findOne({ $or: [{ email }, { phoneNumber }] });
      if (existingUser) return res.status(400).json({ message: "This user with the email or phone number already exists" })

      const userName = `${firstName} ${lastName}`

      const user = await userModel.model.create({ fullName: userName, email, phoneNumber, password: encryptedPass, role: "Chairman" })
      if (!user) return res.status(500).json({ message: "Failed to create User. Try Again" })

      //society assign alredy exists
      const existingSociety = await societyHandlerModel.model.findOne({ selectSociety });
      console.log(selectSociety);

      if (existingSociety) return res.status(400).json({ message: "This user is already assigned to selected society" })
      delete req.body.password
      delete req.body.confirmPassword
      const data = {
        selectSociety,
        userId: user._id,
        country: country,
        state: state,
        city: city,
        zipCode: zipCode,
      }
      const result = await societyHandlerModel.model.create({ ...data })
      if (!result) return res.status(500).json({ message: "Failed tp asign society. Try Again" })
      return res.status(200).send({ message: httpSuccess, data: result })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Server error", error: error.message })
    }
  }


}

const societyHandlerController = new SocietyHandlerController()
module.exports = societyHandlerController