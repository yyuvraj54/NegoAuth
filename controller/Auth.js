const bcrypt =require("bcrypt");
const User=require("../models/User");
// const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async(req,res) => {
    try{
        const {name,password,email}=req.body;
        const existingUser=await User.find({email});
        console.log("Hit")
        if(existingUser.at(0)){
            return res.status(400).json({
                success:false,
                message:"User Alredy Exists",
                code:existingUser
            });
        }

        try{
            let hashedPassword =await bcrypt.hash(password,10);

            const user=await User.create({
                name,email,password:hashedPassword
            });
            return res.status(200).json({
                success:true,
                message:"User Created Successfully"
            });
        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"Failed to hash the password"
            });
        }

    }
    catch(error){
        console.error(error);
        return res.status(400).json({
            success:false,
            message:"User Alredy Exists" 
        });
    }
}






