const randomstring = require("randomstring");
const securityModel = require("../models/SecurityModel.js");
const sendEmail = require("../mailconfig/Nodemailer.js");
const bcrypt = require("bcrypt");
const { uploadMedia, httpSuccess, httpErrors } = require("../constents.js");
const userModel = require("../models/UserModel.js");

class SecurityController {
  async createSecurity(req, res) {
    try {
      const { fullName, email, phoneNumber, gender, shift, joiningDate, shiftTime, societyId } = req.body;
      let { profileImage, adharCardImage } = req.files;

      if (!societyId || !fullName || !email || !phoneNumber || !gender || !shift || !joiningDate || !shiftTime || !profileImage || !adharCardImage) {
        return res.status(400).json({ message: "Missing required fields. Please provide all necessary information." });
      }

      let password = randomstring.generate({ length: 8, charset: "alphabetic" });
      const encryptedPass = bcrypt.hashSync(password, 5);
      if (!encryptedPass) {
        return res.status(500).json({ message: "Password encryption failed. Please try again." });
      }

      const user = await userModel.model.create({ fullName, email, password: encryptedPass, phoneNumber, role: "Security" });
      if (!user) {
        return res.status(500).json({ message: "Failed to create user. Please try again later." });
      }

      profileImage = profileImage[0].path;
      adharCardImage = adharCardImage[0].path;

      const text = `Dear ${fullName},\n\nWe have generated a password for your account. Please use the following credentials to log in:\n**Password**: ${password}\n\nFor your security, we recommend changing your password once you log in. If you didn’t request this password, please contact our support team immediately.\n\nBest regards,\nSociety-management-Team`;
      const subject = `Login Credentials for Dashstack`;

      sendEmail({ to: email, subject, text });

      const securityData = {
        userId: user._id,
        gender,
        shift,
        joiningDate,
        shiftTime,
        societyId,
        profileImage,
        adharCardImage
      };

      const result = await securityModel.model.create({ ...securityData });
      if (!result) {
        return res.status(500).json({ message: "Failed to create security entry. Please try again later." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async getSecurity(req, res) {
    try {
      const { societyId } = req.params;

      if (!societyId) {
        return res.status(400).json({ message: "Society ID is required." });
      }

      const result = await securityModel.model.find({ societyId }).populate([{ path: 'societyId' }, { path: 'userId' }]);
      if (!result || result.length === 0) {
        return res.status(405).json({ message: "No security personnel found for the given society." });
      }

      return res.status(200).json({ message: httpSuccess, data: result });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async deleteSecurity(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Security ID is required." });
      }

      let data = await securityModel.model.findOne({ _id: id });
      if (!data) {
        return res.status(405).json({ message: "Security personnel not found." });
      }

      data = data._doc;
      let userData = await userModel.model.deleteOne({ _id: data.userId });
      if (!userData || userData.deletedCount < 1) {
        return res.status(500).json({ message: "Failed to delete user data. Please try again." });
      }

      const result = await securityModel.model.deleteOne({ _id: id });
      if (!result || result.deletedCount < 1) {
        return res.status(500).json({ message: "Failed to delete security entry. Please try again." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }

  async updateSecurity(req, res) {
    try {
      const { id } = req.params;
      const { fullName, email, phoneNumber, gender, shift, joiningDate, shiftTime, societyId } = req.body;
      let profileImage, adharCardImage;

      if (!id) {
        return res.status(400).json({ message: "Security ID is required." });
      }

      let data = await securityModel.model.findOne({ _id: id });
      if (!data) {
        return res.status(405).json({ message: "Security personnel not found." });
      }

      data = data._doc;
      const user = await userModel.model.findOneAndUpdate({ _id: data.userId }, { fullName, email, phoneNumber }, { new: true });
      if (!user) {
        return res.status(500).json({ message: "Failed to update user. Please try again later." });
      }

      if (req.files?.profileImage) {
        profileImage = req.files.profileImage[0].path;
      } else {
        profileImage = data.profileImage;
      }

      if (req.files?.adharCardImage) {
        adharCardImage = req.files.adharCardImage[0].path;
      } else {
        adharCardImage = data.adharCardImage;
      }

      const updateData = {
        societyId,
        userId: user._id,
        gender,
        shift,
        joiningDate,
        shiftTime,
        profileImage,
        adharCardImage
      };

      const result = await securityModel.model.updateOne({ _id: id }, { ...updateData });
      if (!result || result.modifiedCount < 1) {
        return res.status(400).json({ message: "Failed to update security data. Please try again." });
      }

      return res.status(200).json({ message: httpSuccess });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error occurred. Please try again later.", error: error.message });
    }
  }
}

const securityController = new SecurityController();
module.exports = securityController;
