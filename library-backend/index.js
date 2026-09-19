const startServer =require('./server')
require('dotenv').config()
const connectToDB= require('./db')

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const main = async ()=>{
  await connectToDB(MONGODB_URI)
  startServer(PORT)
}

main()