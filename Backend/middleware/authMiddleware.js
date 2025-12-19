
import jwt from 'jsonwebtoken'

const JWT_SECRET= process.env.JWT_SECRET

export const verifyToken = (req, res, next)=>{
    const token = req.cookies?.accessToken

    if(!token){
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    })
}
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
    success:false,
    error: "Token expired or invalid",
  })
  }

}