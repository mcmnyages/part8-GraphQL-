const mongoose = require('mongoose')
const dns = require('dns')

const connectToDB = async(uri)=>{
    console.log('Connnecting to database URI:',uri)
    dns.setServers(['1.1.1.1','8.8.8.8'])
    try{
        await mongoose.connect(uri)
        console.log('Connected to',uri)
    }catch(error){
        console.log('Error connecting to MongoDB:',error.message)
        process.exit(1)
    }
}

module.exports = connectToDB