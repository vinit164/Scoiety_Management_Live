const { uploadMedia, httpSuccess, httpErrors } = require("../constents");
const memberModel = require("../models/MemberModel");
const randomstring = require("randomstring");
const sendEmail = require("../mailconfig/Nodemailer");
const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel");
const util = require('util');

class MemberController {
  async createMember(req, res) {
    try {
      console.log("body =====> ", req.body)
      console.log("files =====> ", req.files)
      console.log("body =====> ", JSON.stringify(req.body, null, 2));
      console.log("files =====> ", JSON.stringify(req.files, null, 2));

      let { societyId, residentStatus, fullName, email, phoneNumber, age, wing, unit, familyMember, vehicle, OwnerInfo, gender } = req.body;
      let { profileImage, aadharFront, aadharBack, veraBill, agreement } = req.files;

      // Validate required fields
      if (!societyId || !residentStatus || !fullName || !email || !phoneNumber || !age || !wing || !unit || !profileImage || !aadharFront || !aadharBack || !veraBill || !agreement || !familyMember || !vehicle) {
        return res.status(400).send({ message: "All required fields must be provid." });
      }

      // Validate tenant data
      if (residentStatus === "Tenant" && !OwnerInfo) {
        return res.status(400).send({ message: "Owner information is required for tenants." });
      }

      // Parse family members and vehicle details
      familyMember = JSON.parse(familyMember);
      vehicle = JSON.parse(vehicle);
      phoneNumber = Number(phoneNumber);
      age = Number(age);

      familyMember = familyMember.map((member) => ({
        ...member,
        age: Number(member.age),
        phoneNumber: Number(member.phoneNumber),
      }));

      const password = randomstring.generate({ length: 8, charset: "alphabetic" });
      const encryptedPass = bcrypt.hashSync(password, 5);
      if (!encryptedPass) {
        return res.status(500).send({ message: "Error generating password." });
      }

      const user = await userModel.model.create({ fullName, email, password: encryptedPass, phoneNumber, role: "Member" });
      if (!user) {
        return res.status(500).send({ message: "Error creating user." });
      }

      profileImage = profileImage[0].path;
      aadharFront = aadharFront[0].path;
      aadharBack = aadharBack[0].path;
      veraBill = veraBill[0].path;
      agreement = agreement[0].path;

      const emailText = `Dear ${fullName},

      We have generated a password for your account. Please use the following credentials to log in:
      **Password**: ${password}

      For your security, we recommend changing your password once you log in. If you didn’t request this password, please contact our support team immediately.

      Best regards,
      Society-management-Team`;

      const subject = "Login Credential For Dashstack";
      sendEmail({ to: email, subject, text: emailText });

      const data = {
        userId: user._id,
        residentStatus,
        age,
        gender,
        wing,
        unit,
        familyMember,
        vehicle,
        profileImage,
        aadharFront,
        aadharBack,
        veraBill,
        agreement,
        societyId,
      };

      let result;
      if (residentStatus === "Tenant") {
        OwnerInfo = JSON.parse(OwnerInfo);
        result = await memberModel.model.create({ ...data, OwnerInfo });
      } else {
        result = await memberModel.model.create({ ...data });
      }

      if (!result) {
        return res.status(500).send({ message: "Error saving member data." });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.log("error ====> ", error);
      return res.status(500).send({ message: "Error creating member.", error: error.message });
    }
  }

  async listMember(req, res) {
    try {
      const { societyId } = req.params;
      const members = await memberModel.model.find({ societyId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }]);
      if (!members || members.length === 0) {
        return res.status(405).send({ message: "No members found for the given society." });
      }
      return res.status(200).send({ message: httpSuccess, data: members });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error retrieving members.", error: error.message });
    }
  }

  async listMemberByWing(req, res) {
    try {
      const { wingId } = req.params;
      const members = await memberModel.model.find({ wing: wingId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }]);
      if (!members || members.length === 0) {
        return res.status(405).send({ message: "No members found in the given wing." });
      }
      return res.status(200).send({ message: httpSuccess, data: members });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error retrieving members by wing.", error: error.message });
    }
  }

  async listMemberByUnit(req, res) {
    try {
      const { unitId } = req.params;
      const member = await memberModel.model.findOne({ unit: unitId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }]);
      if (!member) {
        return res.status(405).send({ message: "No member found for the given unit." });
      }
      return res.status(200).send({ message: httpSuccess, data: member });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error retrieving member by unit.", error: error.message });
    }
  }

  async getMemberById(req, res) {
    try {
      const { memberId } = req.params;
      const member = await memberModel.model.findOne({ userId: memberId }).populate([{ path: "userId" }, { path: "wing" }, { path: "unit" }]);
      if (!member) {
        return res.status(405).send({ message: "Member not found." });
      }
      return res.status(200).send({ message: httpSuccess, data: member });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error retrieving member.", error: error.message });
    }
  }

  async updateMember(req, res) {
    try {
      let { residentStatus, unitStatus, fullName, email, phoneNumber, age, wing, unit, familyMember, vehicle, OwnerInfo, memberId } = req.body;
      let { profileImage, aadharFront, aadharBack, veraBill, agreement } = req.files;

      unitStatus = "Occupied"; // Default to "Occupied" for simplicity
      // Check required fields
      if (!memberId || !residentStatus || !unitStatus || !fullName || !email || !phoneNumber || !age || !wing || !unit || !familyMember || !vehicle) {
        return res.status(400).send({ message: "All required fields must be provided." });
      }
      if (residentStatus === "Tenant" && !OwnerInfo) {
        return res.status(400).send({ message: "Owner information is required for tenants." });
      }

      // Parse family and vehicle data
      familyMember = JSON.parse(familyMember);
      vehicle = JSON.parse(vehicle);
      phoneNumber = Number(phoneNumber);
      age = Number(age);

      // Find existing member and update user details
      const member = await memberModel.model.findOne({ _id: memberId });
      if (!member) {
        return res.status(405).send({ message: "Member not found." });
      }

      const user = await userModel.model.findOneAndUpdate({ _id: member.userId }, { fullName, email, phoneNumber, role: "Member" }, { new: true });
      if (!user) {
        return res.status(500).send({ message: "Error updating user details." });
      }

      // Handle file paths
      profileImage = profileImage[0].path;
      aadharFront = aadharFront[0].path;
      aadharBack = aadharBack[0].path;
      veraBill = veraBill[0].path;
      agreement = agreement[0].path;

      // Send email with login details
      const emailText = `Dear ${fullName},

      We have updated your account details. Please use the following credentials to log in:
      **Password**: [your current password]

      Best regards,
      Society-management-Team`;

      const subject = "Updated Login Credentials";
      sendEmail({ to: email, subject, text: emailText });

      // Prepare update data
      const data = {
        userId: user._id,
        residentStatus,
        unitStatus,
        age,
        wing,
        unit,
        familyMember,
        vehicle,
        profileImage,
        aadharFront,
        aadharBack,
        veraBill,
        agreement,
      };

      let result;
      if (residentStatus === "Tenant") {
        result = await memberModel.model.findOneAndUpdate({ _id: memberId }, { ...data, OwnerInfo: JSON.parse(OwnerInfo) }, { new: true });
      } else {
        result = await memberModel.model.findOneAndUpdate({ _id: memberId }, { ...data }, { new: true });
      }

      if (!result) {
        return res.status(500).send({ message: "Error updating member data." });
      }

      return res.status(200).send({ message: httpSuccess });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error updating member.", error: error.message });
    }
  }
}

const memberController = new MemberController();
module.exports = memberController;
