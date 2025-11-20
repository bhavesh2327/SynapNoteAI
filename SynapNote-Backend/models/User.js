import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowerCase: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    isVerified:{
        type:Boolean,
        required:true,
        default: false,
    },
    otp:{
        type: String
    },
    otpExpiry: {
        type: Date
    },
    resetPasswordToken: { //Random hashed token for password reset
        type: String
    },
    resetPasswordExpiry: { // Expiry timestamp for reset token (e.g., +15 mins)
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;