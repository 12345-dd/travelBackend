require("dotenv").config()
const express = require("express")
const connectDB = require("./db")
const cors = require("cors")

const app = express()

const allowedOrigins = [
  'http://localhost:5173',              
  'https://smarttripai.netlify.app'      
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json())

const userRoutes = require("./routes/userRoutes")
const tripRoutes = require("./routes/tripRoutes")


app.use("/",userRoutes)
app.use("/",tripRoutes)


const PORT = process.env.PORT 

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Started at PORT-${PORT}`)
    })
}).catch((err) => {
    console.log("Failed to connect DB",err)
})