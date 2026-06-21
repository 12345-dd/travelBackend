require("dotenv").config()
const express = require("express")
const connectDB = require("./db")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT 

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Started at PORT-${PORT}`)
    })
}).catch((err) => {
    console.log("Failed to connect DB",err)
})