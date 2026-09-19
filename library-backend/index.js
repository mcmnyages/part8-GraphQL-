const startServer =require('./server')
require('dotenv').config()

const PORT = process.env.PORT
const main =()=>{
  startServer(PORT)
}

main()