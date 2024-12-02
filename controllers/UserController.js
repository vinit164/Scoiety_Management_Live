const { httpErrors, httpSuccess } = require("../constents")
const userModel = require("../models/UserModel")
const societyModel = require("../models/SocietyModel")
const societyHandlerModel = require("../models/SocietyHandlerModel")
const memberModel = require("../models/MemberModel")
const securityModel = require("../models/SecurityModel")
const bcrypt = require("bcrypt")
const sendEmail = require("../mailconfig/Nodemailer");
const { generateOtp } = require('../mailconfig/otpService')
const jwt = require("jsonwebtoken")
const session = require("express-session")

class UserController {
  async loginUser(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) throw httpErrors[400]
      let user
      if (email.length === 10 && typeof (Number(email) === "Number")) {
        const phone = Number(email)
        user = await userModel.model.findOne({ phoneNumber: phone })
        if (!user) throw httpErrors[500]
      } else {
        user = await userModel.model.findOne({ email: email })
        if (!user) throw httpErrors[500]
      }
      let societyData
      if (user.role === "Chairman") {
        societyData = await societyHandlerModel.model.findOne({ userId: user._id })
      } else if (user.role === "Member") {
        societyData = await memberModel.model.findOne({ userId: user._id })
      } else if (user.role === "Security") {
        societyData = await securityModel.model.findOne({ userId: user._id })
      }
      const payload = { ...user._doc, societyData: societyData }
      if (!bcrypt.compareSync(password, user.password)) return res.status(500).send({ message: "Invalid Password" })
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" })
      if (!token) throw httpErrors[500]
      return res.status(200).send({ message: httpSuccess, token })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  async forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.model.findOne({ email: email });
        
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const otp = generateOtp();
        user.otp = otp;
        const otpExpires = Date.now() + 15 * 60 *1000
        user.otpExpires = otpExpires
        await user.save();

        req.session.email = email ;
        req.session.otp = otp ;
        req.session.otpExpires = otpExpires ;
        
        const subject = 'Password Reset OTP';
        const text = `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`;
        await sendEmail({ to: user.email, subject, text });

        res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request.', error: error.message });
    }
  }
  async verifyOtp(req, res) {
    try {
        const {otp } = req.body;

        if (!otp)  return res.status(400).json({ message: 'OTP are required.' });

        const {email , otp:storedOtp , otpExpires} = req.session
        if(!email || !storedOtp) return res.status(401).json({message : "OTP session expires. Try Again"})

        if (storedOtp !== otp) return res.status(401).json({ message: 'Invalid OTP.' });
        if (Date.now() > otpExpires)  return res.status(401).json({ message: 'OTP has expired. Please request a new one.' });

        res.status(200).json({ message: 'OTP verified successfully. You can now reset your password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing request.', error: error.message });
    }
  }
  async resetPassword(req, res){
    try {
      const { email, newPassword } = req.body;
        const user = await userModel.model.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password.', error: error.message });
    }
  };
  async editProfile(req, res) {
    try {
      const { firstName, lastName, email, phoneNumber, societyName , country, state, city, zipCode, societyId } = req.body;
  
      const userId = req.user._id; // User ID from JWT token
  
      // Find user in the database
      const user = await userModel.model.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Update User Information
      const updateData = {};
  
      if (email) updateData.email = email;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
  
      // Create or update the fullName as a combination of firstName and lastName
      if (firstName || lastName) {
        updateData.fullName = `${firstName} ${lastName}`;
      }
  
      // Save updated user data
      await userModel.model.findByIdAndUpdate(userId, updateData, { new: true });
  
      // If the user is a Chairman, update their assigned society data
      if (user.role === "Chairman" && societyId) {
        // Find the corresponding society handler
        const societyHandler = await societyHandlerModel.model.findOne({ userId: userId });
        if (!societyHandler) {
          return res.status(404).json({ message: "Society not assigned to this user." });
        }
  
        // Update society handler with new society ID
        const updateSocietyHandlerData = { selectSociety: societyId };

        // Update the society handler
        await societyHandlerModel.model.findByIdAndUpdate(societyHandler._id, updateSocietyHandlerData);
  
        // Now, update the societyModel with the same location information
        const society = await societyModel.model.findById(societyId);
        if (!society) {
          return res.status(404).json({ message: "Society not found." });
        }
  
        // Update the society model with new location details
        const updateSocietyData = {};
        if (societyName) updateSocietyData.societyName = societyName;
        if (country) updateSocietyData.country = country;
        if (state) updateSocietyData.state = state;
        if (city) updateSocietyData.city = city;
        if (zipCode) updateSocietyData.zipCode = zipCode;
  
        // Update the society model
        await societyModel.model.findByIdAndUpdate(societyId, updateSocietyData, { new: true });
  
        return res.status(200).json({
          message: "Profile updated successfully, and society and society handler updated.",
        });
      }
  
      // Return success response for general user
      return res.status(200).json({
        message: "Profile updated successfully.",
        data: updateData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating profile.", error: error.message });
    }
  }
  

  async authenticationPermission(req, res) {
    try {
      const { id, password } = req.body // id : Society Chairman Id
      const result = await userModel.model.findOne({ _id: id })
      if (!result) throw httpErrors[500]
      if (!bcrypt.compareSync(password, result.password)) return res.status(401).send({ message: "Invalid Password" })
      return res.status(200).send({ message: httpSuccess })
    } catch (error) {
      console.log(error)
      throw httpErrors[500]
    }
  }
  
  
}

const userController = new UserController();
module.exports = userController;
