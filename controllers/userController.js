const userSchema = require("../models/userModel")
const hashed = require("../utils/hashed")
const jwtUtils = require("../utils/jwt")

const createUser = async(req,res) => {
    try{
        req.body.password = await hashed.hashedPassword(req.body?.password)
        const newUser = await userSchema.create(req.body)
        if(newUser){
            res.status(201).json({
                message:"New User Created Successfully",
                data: newUser
            })
        }else{
            res.status(404).json({
                message:"Error in creating new User"
            })
        }
    }catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const loginUser = async(req,res) => {
    try{
        const {email,password} = req.body
        const user = await userSchema.findOne({email:email})
        if(user != null){
            const isMatch = await hashed.comparePassword(password,user.password)
            if(isMatch){
                const token = jwtUtils.generateToken(user._id)
                res.status(200).json({
                    message:"Login Successful",
                    token: token
                })
            }else{
                res.status(401).json({
                    message:"Invalid Credentials"
                })
            }
        }else{
            res.status(404).json({
                message:"User Not Found"
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

module.exports = {
    createUser,
    loginUser
}