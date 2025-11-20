import express from "express";
import { signUp, signIn, verifyOtp, forgotPassword, resetPassword } from "../controllers/authController.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/verifyotp", verifyOtp);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.get("/me" , auth , (req , res) => res.status(200).json({success : true , user : req.user}));

export default router;