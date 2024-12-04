const mongoose = require('mongoose')

class SecurityProtocolModel {
  constructor() {
    this.schema = new mongoose.Schema({
      societyId: { type: String, required: true, ref: 'tbl_societies' },
      title: { type: String, required: true },
      discription: { type: String, required: true },
    }, { timestamps: true })

    this.model = mongoose.model("tbl_securityprotocols", this.schema)
  }
}

const securityProtocolModel = new SecurityProtocolModel()

module.exports = securityProtocolModel