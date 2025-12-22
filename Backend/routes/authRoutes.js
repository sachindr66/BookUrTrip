
import express from "express"
import {  forgotPassword, loginUser, logoutUser, registerUser } from "../controllers/auth.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post('/register', registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/forgot-password", forgotPassword)

router.get("/profile", verifyToken,(req, res)=>{
    res.json({
        success:true,
        user:req.user
    })
})

export default router