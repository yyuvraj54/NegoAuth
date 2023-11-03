const bcrypt =require("bcrypt");
const User=require("../models/User");
const jwt = require("jsonwebtoken");
const { undefined } = require("webidl-conversions");
require("dotenv").config();

exports.signup = async(req,res) => {
    try{
        const {name,password,email}=req.body;
        const existingUser=await User.find({email});
        console.log("Hit")
        if(existingUser[0]){
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


exports.login = async(req,res)=>{

    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please provide valid username or passsword"
            });
        }
        var existingUser=await User.find({email});
        existingUser=existingUser[0];
        if(!existingUser){
            return res.status(400).json({
                Success:false,
                message:"User not Found"
            });
        }

        const payload ={
            email:existingUser.email,
            id:existingUser._id,
        };

        if(await bcrypt.compare(password,existingUser.password)){

            let token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"})

            existingUser=existingUser.toObject();
            existingUser.token=token;
            existingUser.password=undefined;

            const option={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("cookie1",token,option).status(200).json({
                success:"True",
                token,
                existingUser,
                message:"User Logged In Successfully"
            });

        }
        else{
            return  res.status(403).json({
                Success:"Failed",
                message:"Password Incorrect"
            });
        }

    }
    catch(error){
        console.error(error)
        return  res.status(400).json({
            Success:"Failed",
            message:"something went wrong!"
        });

        
    }
    
}






