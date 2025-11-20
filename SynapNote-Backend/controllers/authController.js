import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { sendEmail, sendPasswordResetEmail } from "../services/mailSender.js";
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

export const signUp = async (req, res) => {
    try {
        // user input -> name , email , password
        // then after that otp is send to the use email
        // then verify the otp
        // hash the password
        // then create the user
        const {name , email , password} = req.body;
        // validate user data
        if(!name || !email || !password){
            return res.status(400).json({error : "Please fill all the fields"});
        }

        // check if user already exist
        const user = await User.findOne({email});
        if(user && user.isVerified){
            return res.status(400).json({
                success: false,
                message : "User already exist",
                error : "User already exist"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date( Date.now() + 15 * 60 * 1000 );

        if(user && !user.isVerified){
            user.name = name;
            user.email = email;
            user.passwordHash = hashedPassword;
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        }
        else {
            const newUser = new User({
            name,
            email,
            passwordHash : hashedPassword,
            otp,
            otpExpiry,
        });
        await newUser.save();
        }

        await sendEmail({
            to: email,
            subject: 'Your SynapNote Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to SynapNote!</h2>
                    <p>Thank you for signing up. Please use the following OTP to verify your account:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="background-color: #007bff; color: white; padding: 15px 30px; 
                                     font-size: 24px; font-weight: bold; letter-spacing: 2px;
                                     border-radius: 5px; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    <p><strong>This OTP will expire in 15 minutes.</strong></p>
                    <p>If you didn't create this account, please ignore this email.</p>
                    <p>Best regards,<br>The SynapNote Team</p>
                </div>
            `
        });

        res.status(201).json({
            success : true,
            message : "User created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error While Creating User",
            error: error.message
        });
    }
}

export const verifyOtp = async (req , res) => {
    try {
        const {email , otp} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success: false,
                message : "User doesn't exist",
                error : "User doesn't exist"
            });
        }

        if(user.isVerified){
            return res.status(400).json({
                success: false,
                message : "User already verified",
                error : "User already verified"
            });
        }

        if(user.otpExpiry < Date.now()){
            return res.status(400).json({
                success: false,
                message : "OTP Expired",
                error : "OTP Expired"
            });
        }

        if(user.otp !== otp){
            return res.status(400).json({
                success: false,
                message : "Invalid OTP",
                error : "Invalid OTP"
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            success : true,
            message : "User verified successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error While Verifying User",
            error: error.message
        });
    }
}

export const signIn = async (req , res)=>{
    // user input -> email , password
    // then check if user exist
    // then check if user is verified
    // then check if password is correct
    // then generate jwt token
    // 
    try {
        const {email , password} = req.body;
        // validate user data
        if(!email || !password){
            return res.status(400).json({error : "Please fill all the fields"});
        }
        // check if user exist
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message : "User doesn't exist",
                error : "User doesn't exist"
            });
        }
        // check if user is verified
        if(!user.isVerified){
            return res.status(403).json({
                success: false,
                message : "User is not verified , Sign Up Again!!",
                error : "User is not verified"
            });
        }
        // check if password is correct
        const isMatch = await bcrypt.compare(password , user.passwordHash);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message : "Invalid Password",
                error : "Invalid Password"
            });
        }
        // generate jwt token
        const token = jwt.sign({ name: user.name, id : user._id , email : user.email} , process.env.JWT_SECRET , {
            expiresIn : "1d"
        });
        // send jwt token
        res.status(200).json({
            success : true,
            message : "User logged in successfully",
            token : token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error While Logging In User",
            error: error.message
        });
    }
}

export const forgotPassword = async (req , res)=>{
    try {
        const {email } = req.body;
        if(!email){
            return res.status(400).json({
                success: false,
                message : "Please fill all the fields",
                error : "Please fill all the fields"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success: false,
                message : "User doesn't exist",
                error : "User doesn't exist"
            });
        }

        if(!user.isVerified){
            return res.status(403).json({
                success: false,
                message : "User is not verified",
                error : "User is not verified"
            });
        }

        const resetPasswordToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const response = await sendPasswordResetEmail(email , resetPasswordToken , user.name);
        console.log(response);
        
          return res.status(200).json({
            success: true,
            message : "Email sent successfully",
          });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error While Sending Password Reset Email",
            error: error.message
        });
    }
}

export const resetPassword = async (req , res)=>{
    try {
        const {resetPasswordToken , newPassword} = req.body;
        if(!resetPasswordToken || !newPassword){
            return res.status(400).json({
                success: false,
                message : "Please fill all the fields",
                error : "Please fill all the fields"
            });
        }

        const user = await User.findOne({resetPasswordToken});
        if(!user){
            return res.status(404).json({
                success: false,
                message : "User doesn't exist",
                error : "User doesn't exist"
            });
        }

        if(user.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message : "Password reset token expired",
                error : "Password reset token expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);
        user.passwordHash = hashedPassword;
        user.resetPasswordToken = null;
        await user.save();
        return res.status(200).json({
            success: true,
            message : "Password reset successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error While Resetting Password",
            error: error.message
        });
    }
}
