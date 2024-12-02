const { default: mongoose } = require('mongoose')
const dotenv = require('dotenv')

const connection = async () =>{
    try {
    const db = await mongoose.connect(process.env.DBURL)
    console.log("connection establised")
        
    } catch (error) {
        console.log(error)
        console.log("db connection failed")
    }
}

module.exports = connection